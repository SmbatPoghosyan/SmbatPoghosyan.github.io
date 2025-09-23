'use server';

import { createClient } from 'contentful-management';
import { revalidatePath } from 'next/cache';

const spaceId = process.env.CONTENTFUL_SPACE_ID;
const managementToken = process.env.CONTENTFUL_MANAGEMENT_TOKEN;
const environmentId = 'master';

export async function createCategory(title: string, order: number) {
  if (!spaceId || !managementToken) {
    return { error: 'Contentful environment variables are not configured.' };
  }

  try {
    const client = createClient({
      accessToken: managementToken,
    });

    const space = await client.getSpace(spaceId);
    const environment = await space.getEnvironment(environmentId);

    const entry = await environment.createEntry('professionalSkillCategory', {
      fields: {
        title: { 'en-US': title },
        order: { 'en-US': order },
      },
    });

    const publishedEntry = await entry.publish();

    revalidatePath('/');
    return {
      success: true,
      message: 'Category created successfully.',
      entryId: publishedEntry.sys.id,
    };
  } catch (error) {
    console.error('Contentful create failed:', error);
    return { error: 'Failed to create Contentful entry.' };
  }
}

export async function updateCategory(id: string, title: string, order: number) {
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
      entry.fields.title = { 'en-US': title };
      entry.fields.order = { 'en-US': order };

      const updatedEntry = await entry.update();
      await updatedEntry.publish();

      revalidatePath('/');
      return { success: true, message: 'Category updated successfully.' };
    } else {
      return { error: `Entry with ID ${id} not found.` };
    }
  } catch (error) {
    console.error('Contentful update failed:', error);
    return { error: 'Failed to update Contentful entry.' };
  }
}

export async function deleteCategory(id: string) {
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
      return { success: true, message: 'Category deleted successfully.' };
    } else {
      return { error: `Entry with ID ${id} not found.` };
    }
  } catch (error) {
    console.error('Contentful delete failed:', error);
    return { error: 'Failed to delete Contentful entry.' };
  }
}
