import { NextRequest, NextResponse } from 'next/server'
import { supabaseServer } from '@/src/lib/supabaseServer'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
  try {
    // Get the session from cookies
    const cookieStore = await cookies()
    const authToken = cookieStore.get('sb-access-token')?.value

    if (!authToken) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }

    // Get user from session
    const { data: { user }, error: authError } = await supabaseServer.auth.getUser(authToken)

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }

    // Fetch profile with related data
    const { data: profileData, error: profileError } = await supabaseServer
      .from('profiles')
      .select(`
        id,
        username,
        display_name,
        profile_image_url,
        interests_intro,
        skills_intro,
        profile_skills (
          skill_id,
          type,
          skills (
            id,
            name,
            category
          )
        ),
        profile_location (
          is_discoverable,
          address_label,
          lat,
          lng
        )
      `)
      .eq('id', user.id)
      .single()

    if (profileError && profileError.code !== 'PGRST116') {
      // PGRST116 = not found, which is fine for new profiles
      console.error('Error loading profile:', profileError)
      return NextResponse.json(
        { error: 'Failed to load profile' },
        { status: 500 }
      )
    }

    // Transform the data to a cleaner format
    if (profileData) {
      const transformedProfile = {
        id: profileData.id,
        username: profileData.username,
        displayName: profileData.display_name,
        profileImageUrl: profileData.profile_image_url,
        interestsIntro: profileData.interests_intro,
        skillsIntro: profileData.skills_intro,
        skills: (profileData.profile_skills || []).map((ps: any) => ({
          id: ps.skills?.id,
          name: ps.skills?.name,
          category: ps.skills?.category,
          type: ps.type,
        })),
        location: (() => {
          const loc = Array.isArray(profileData.profile_location)
            ? profileData.profile_location[0]
            : profileData.profile_location
          return loc ? {
            isDiscoverable: loc.is_discoverable,
            addressLabel: loc.address_label,
            lat: loc.lat,
            lng: loc.lng,
          } : null
        })(),
      }

      return NextResponse.json({ profile: transformedProfile })
    }

    // No profile found - return empty structure
    return NextResponse.json({
      profile: null,
    })
  } catch (error) {
    console.error('Error in profile/me API:', error)
    return NextResponse.json(
      { error: 'Failed to fetch profile' },
      { status: 500 }
    )
  }
}
