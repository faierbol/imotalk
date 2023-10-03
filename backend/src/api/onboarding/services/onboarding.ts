interface User {
  id: number;
  username: string;
  email: string;
  provider: string;
  password: string;
  resetPasswordToken?: string;
  confirmationToken?: string;
  confirmed?: boolean;
  blocked?: boolean;
  role?: string;
}

interface OnboardData {
  username: string;
  email: string;
  provider: string;
  password: string;
  resetPasswordToken?: string;
  confirmationToken?: string;
  confirmed?: boolean;
  blocked?: boolean;
  role?: string;
  userType?: 'Private' | 'Business';
  agentType?: 'Solo' | 'PartOfOrg';
  profile_picture?: string;
  contact_details?: string;
  bio?: string;
  website?: string;
  working_hours?: string;
  license_number?: string;
  cover_photo?: string;
  logo?: string;
  description?: string;
}

interface OnboardResponse {
  success: boolean;
}

export async function onboard(data: OnboardData): Promise<OnboardResponse> {
  try {
    // Create a new user
    const user: User = await strapi.plugins['users-permissions'].services.user.add({
      username: data.username,
      email: data.email,
      provider: data.provider,
      password: data.password,
      resetPasswordToken: data.resetPasswordToken,
      confirmationToken: data.confirmationToken,
      confirmed: data.confirmed,
      blocked: data.blocked,
      role: data.role
    });

    if (data.userType === 'Private') {
      // Create and link UserProfile
      await strapi.entityService.create("api::user-profile.user-profile", {
        data: {
          profile_picture: data.profile_picture,
          contact_details: data.contact_details ? JSON.parse(data.contact_details) : null,         
          bio: data.bio,
          user: user.id
        }
      });
    } else if (data.userType === 'Business') {
      if (data.agentType === 'Solo') {
        // Create and link AgentProfile
        await strapi.entityService.create("api::agent-profile.agent-profile", {
          data: {
            website: data.website,
            profile_picture: data.profile_picture,
            working_hours: data.working_hours ? JSON.parse(data.working_hours) : null,
            contact_details: data.contact_details ? JSON.parse(data.contact_details) : null,            
            license_number: data.license_number,
            bio: data.bio,
            user: user.id
          }
        });
      } else if (data.agentType === 'PartOfOrg') {
        // Create and link AgentProfile
        await strapi.entityService.create("api::agent-profile.agent-profile", {
          data: {
            website: data.website,
            profile_picture: data.profile_picture,
            working_hours: data.working_hours ? JSON.parse(data.working_hours) : null,
            contact_details: data.contact_details ? JSON.parse(data.contact_details) : null,            
            license_number: data.license_number,
            bio: data.bio,
            user: user.id
          }
        });

        // Create new organization
        const organization = await strapi.entityService.create("api::organization-profile.organization-profile", {
          data: {
            org_name: data.username,
            website: data.website,
            cover_photo: data.cover_photo,
            logo: data.logo,
            working_hours: data.working_hours ? JSON.parse(data.working_hours) : null,
            contact_details: data.contact_details ? JSON.parse(data.contact_details) : null,
            license_number: data.license_number,
            description: data.description,
            user: user.id,
          }
        });

        // Create OrganizationMember for this user as Owner
        await strapi.entityService.create("api::organization-member.organization-member", {
          data: {
            role: 'Owner',
            organization: organization.id,
            user: user.id
          }
        });

        // Update the Organization Profile to include this user in the members list
        // here we need the logic to update the Organization Profile to include ownerin the members list
      }
    }
  } catch (error) {
    console.error(error);
    throw new Error('Onboarding failed');
  }

  return { success: true };
}
