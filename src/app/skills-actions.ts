'use server';

import { createClient } from 'contentful-management';
import { revalidatePath } from 'next/cache';

const spaceId = process.env.CONTENTFUL_SPACE_ID;
const managementToken = process.env.CONTENTFUL_MANAGEMENT_TOKEN;
const environmentId = 'master';

export async function createSkill(category: string, name: string, strength: number) {
  if (!spaceId || !managementToken) {
    return { error: 'Contentful environment variables are not configured.' };
  }

  try {
    const client = createClient({
      accessToken: managementToken,
    });

    const space = await client.getSpace(spaceId);
    const environment = await space.getEnvironment(environmentId);

    const entry = await environment.createEntry('professionalSkill', {
      fields: {
        category: { 'en-US': category },
        name: { 'en-US': name },
        strength: { 'en-US': strength },
      },
    });

    await entry.publish();

    revalidatePath('/');
    return { success: true, message: 'Skill created successfully.' };
  } catch (error) {
    console.error('Contentful create failed:', error);
    return { error: 'Failed to create Contentful entry.' };
  }
}

export async function updateSkill(id: string, category: string, name: string, strength: number) {
  if (!spaceId || !managementToken) {
    return { error: 'Contentful environment variables are not configured.' };
  }

  try {
    const client = createClient({
      accessToken: managementToken,
    });

    const space = await client.getSpace(spaceId);
    const environment = await space.getEnvironment(environmentId);
    const entry = await environment.getEntry(id);

    if (entry) {
      entry.fields.category = { 'en-US': category };
      entry.fields.name = { 'en-US': name };
      entry.fields.strength = { 'en-US': strength };

      const updatedEntry = await entry.update();
      await updatedEntry.publish();

      revalidatePath('/');
      return { success: true, message: 'Skill updated successfully.' };
    } else {
      return { error: `Entry with ID ${id} not found.` };
    }
  } catch (error) {
    console.error('Contentful update failed:', error);
    return { error: 'Failed to update Contentful entry.' };
  }
}

export async function deleteSkill(id: string) {
  if (!spaceId || !managementToken) {
    return { error: 'Contentful environment variables are not configured.' };
  }

  try {
    const client = createClient({
      accessToken: managementToken,
    });

    const space = await client.getSpace(spaceId);
    const environment = await space.getEnvironment(environmentId);
    const entry = await environment.getEntry(id);

    if (entry) {
      await entry.unpublish();
      await entry.delete();

      revalidatePath('/');
      return { success: true, message: 'Skill deleted successfully.' };
    } else {
      return { error: `Entry with ID ${id} not found.` };
    }
  } catch (error) {
    console.error('Contentful delete failed:', error);
    return { error: 'Failed to delete Contentful entry.' };
  }
}
