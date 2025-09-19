'use server';

import { createClient } from 'contentful-management';
import { revalidatePath } from 'next/cache';

const spaceId = process.env.CONTENTFUL_SPACE_ID;
const managementToken = process.env.CONTENTFUL_MANAGEMENT_TOKEN;
const environmentId = 'master';
const entryId = 'about-me-primary';

export async function updateAboutMeText(newText: string) {
  if (!spaceId || !managementToken) {
    return { error: 'Contentful environment variables are not configured.' };
  }

  try {
    const client = createClient({
      accessToken: managementToken,
    });

    const space = await client.getSpace(spaceId);
    const environment = await space.getEnvironment(environmentId);
    const entry = await environment.getEntry(entryId);

    if (entry) {
      entry.fields.text = {
        'en-US': newText,
      };

      const updatedEntry = await entry.update();
      await updatedEntry.publish();

      revalidatePath('/');
      return { success: true, message: 'About me text updated successfully.' };
    } else {
      return { error: `Entry with ID ${entryId} not found.` };
    }
  } catch (error) {
    console.error('Contentful update failed:', error);
    return { error: 'Failed to update Contentful entry.' };
  }
}
