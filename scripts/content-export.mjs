#!/usr/bin/env node
/**
 * Content export — generate one Word doc per page from content-export/manifest.json.
 *
 * Workflow:
 *   1. `npm run content:export`           → reads manifest.json, writes content-export/pages/*.docx
 *   2. Open each .docx in Word, edit text inside the boxes (don't touch the [id: ...] markers).
 *   3. Drop edited files in content-export/edits-inbox/
 *   4. In Cowork, say "apply edits in content-export/edits-inbox" — Claude will parse the edited
 *      docs, update both this manifest and the JSX, commit to GitHub.
 *
 * Adding a new page: add an entry under `pages` in manifest.json with stable IDs, then re-run.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  ExternalHyperlink,
  HeadingLevel,
  AlignmentType,
  PageOrientation,
  BorderStyle,
} from "docx";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const exportDir = path.join(root, "content-export");
const pagesDir = path.join(exportDir, "pages");
const manifestPath = path.join(exportDir, "manifest.json");

if (!fs.existsSync(manifestPath)) {
  console.error(`No manifest at ${manifestPath}`);
  process.exit(1);
}

fs.mkdirSync(pagesDir, { recursive: true });

const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));

const COLORS = {
  ink: "1F2937",          // primary text
  subtle: "6B7280",        // secondary text
  faint: "9CA3AF",         // ID markers, helper notes
  rule: "D1D5DB",          // dividers
  link: "2563EB",          // hyperlinks
};

const BASE_FONT = "Calibri";

function plainRunsFromField(field) {
  if (field.type === "plain") {
    return [{ text: field.current ?? "" }];
  }
  if (field.type === "rich") {
    return field.runs ?? [];
  }
  return [{ text: "" }];
}

function runsToDocxChildren(runs) {
  // Convert manifest run objects → docx TextRun / ExternalHyperlink children.
  const children = [];
  for (const r of runs) {
    const text = r.text ?? "";
    if (r.link) {
      const href = r.link.startsWith("http")
        ? r.link
        : `https://dabble.it.com${r.link.startsWith("/") ? r.link : `/${r.link}`}`;
      children.push(
        new ExternalHyperlink({
          link: href,
          children: [
            new TextRun({
              text,
              bold: !!r.bold,
              italics: !!r.italic,
              color: COLORS.link,
              underline: {},
              font: BASE_FONT,
            }),
          ],
        })
      );
    } else {
      children.push(
        new TextRun({
          text,
          bold: !!r.bold,
          italics: !!r.italic,
          font: BASE_FONT,
        })
      );
    }
  }
  return children;
}

function divider() {
  return new Paragraph({
    border: {
      bottom: { color: COLORS.rule, size: 6, style: BorderStyle.SINGLE, space: 1 },
    },
    spacing: { before: 240, after: 240 },
    children: [new TextRun({ text: "" })],
  });
}

function fieldBlock(field) {
  const out = [];

  // Label
  out.push(
    new Paragraph({
      spacing: { before: 200, after: 60 },
      children: [
        new TextRun({
          text: field.label,
          bold: true,
          size: 20, // 10pt
          color: COLORS.subtle,
          font: BASE_FONT,
        }),
      ],
    })
  );

  // Editable content
  const runs = plainRunsFromField(field);
  out.push(
    new Paragraph({
      spacing: { before: 0, after: 60, line: 320 },
      children: runsToDocxChildren(runs),
    })
  );

  // ID marker (faint, do not edit)
  out.push(
    new Paragraph({
      spacing: { before: 0, after: 120 },
      children: [
        new TextRun({
          text: `[id: ${field.id}]`,
          italics: true,
          size: 16, // 8pt
          color: COLORS.faint,
          font: BASE_FONT,
        }),
      ],
    })
  );

  return out;
}

function sectionBlock(section) {
  const out = [];

  out.push(
    new Paragraph({
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 360, after: 80 },
      children: [
        new TextRun({
          text: section.name,
          bold: true,
          size: 28, // 14pt
          color: COLORS.ink,
          font: BASE_FONT,
        }),
      ],
    })
  );

  if (section.blurb) {
    out.push(
      new Paragraph({
        spacing: { before: 0, after: 120 },
        children: [
          new TextRun({
            text: section.blurb,
            italics: true,
            size: 18, // 9pt
            color: COLORS.subtle,
            font: BASE_FONT,
          }),
        ],
      })
    );
  }

  for (const field of section.fields) {
    out.push(...fieldBlock(field));
  }

  out.push(divider());

  return out;
}

function instructionsBlock() {
  return [
    new Paragraph({
      spacing: { before: 0, after: 80 },
      children: [
        new TextRun({
          text: "How to edit this doc",
          bold: true,
          size: 22,
          color: COLORS.ink,
          font: BASE_FONT,
        }),
      ],
    }),
    new Paragraph({
      spacing: { before: 0, after: 60 },
      children: [
        new TextRun({
          text:
            "• Edit text directly. Bold, italics, and links you set in Word will be preserved on the live site.",
          size: 20,
          color: COLORS.ink,
          font: BASE_FONT,
        }),
      ],
    }),
    new Paragraph({
      spacing: { before: 0, after: 60 },
      children: [
        new TextRun({
          text:
            "• Don't delete the small grey [id: ...] lines — those tell Claude where each piece of text lives in the code.",
          size: 20,
          color: COLORS.ink,
          font: BASE_FONT,
        }),
      ],
    }),
    new Paragraph({
      spacing: { before: 0, after: 60 },
      children: [
        new TextRun({
          text:
            "• Don't add new sections from inside Word. To add or reorder sections (e.g. a new value card), ask Claude in Cowork — that's a code change.",
          size: 20,
          color: COLORS.ink,
          font: BASE_FONT,
        }),
      ],
    }),
    new Paragraph({
      spacing: { before: 0, after: 60 },
      children: [
        new TextRun({
          text:
            "• When done: save the file, drop it in content-export/edits-inbox/, then in Cowork say \u201capply edits in content-export/edits-inbox.\u201d",
          size: 20,
          color: COLORS.ink,
          font: BASE_FONT,
        }),
      ],
    }),
    divider(),
  ];
}

function headerBlock(page) {
  return [
    new Paragraph({
      heading: HeadingLevel.HEADING_1,
      spacing: { before: 0, after: 80 },
      children: [
        new TextRun({
          text: page.title,
          bold: true,
          size: 40, // 20pt
          color: COLORS.ink,
          font: BASE_FONT,
        }),
      ],
    }),
    new Paragraph({
      spacing: { before: 0, after: 60 },
      children: [
        new TextRun({
          text: `Live URL: dabble.it.com${page.url}`,
          size: 18,
          color: COLORS.subtle,
          font: BASE_FONT,
        }),
      ],
    }),
    new Paragraph({
      spacing: { before: 0, after: 240 },
      children: [
        new TextRun({
          text: page.description ?? "",
          italics: true,
          size: 20,
          color: COLORS.subtle,
          font: BASE_FONT,
        }),
      ],
    }),
    divider(),
  ];
}

function buildPageDoc(page) {
  const children = [
    ...headerBlock(page),
    ...instructionsBlock(),
    ...page.sections.flatMap(sectionBlock),
  ];

  return new Document({
    creator: "Dabble content-export",
    title: `${page.title} — dabble.it.com`,
    description: `Editable copy for ${page.url}. Edit in Word, then drop in content-export/edits-inbox.`,
    styles: {
      default: { document: { run: { font: BASE_FONT, size: 22 } } },
      paragraphStyles: [
        {
          id: "Heading1",
          name: "Heading 1",
          basedOn: "Normal",
          next: "Normal",
          quickFormat: true,
          run: { size: 40, bold: true, font: BASE_FONT, color: COLORS.ink },
          paragraph: { spacing: { before: 240, after: 120 }, outlineLevel: 0 },
        },
        {
          id: "Heading2",
          name: "Heading 2",
          basedOn: "Normal",
          next: "Normal",
          quickFormat: true,
          run: { size: 28, bold: true, font: BASE_FONT, color: COLORS.ink },
          paragraph: { spacing: { before: 240, after: 120 }, outlineLevel: 1 },
        },
      ],
    },
    sections: [
      {
        properties: {
          page: {
            size: { width: 12240, height: 15840, orientation: PageOrientation.PORTRAIT },
            margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 },
          },
        },
        children,
      },
    ],
  });
}

async function main() {
  let count = 0;
  for (const page of manifest.pages) {
    const doc = buildPageDoc(page);
    const buffer = await Packer.toBuffer(doc);
    const outPath = path.join(pagesDir, `${page.slug}.docx`);
    fs.writeFileSync(outPath, buffer);
    console.log(`✓ ${path.relative(root, outPath)}`);
    count += 1;
  }
  console.log(`\nWrote ${count} page doc${count === 1 ? "" : "s"} → ${path.relative(root, pagesDir)}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
