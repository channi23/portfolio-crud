import { error, fail, redirect } from '@sveltejs/kit';
import { supabase } from '$lib/server/supabase';
import type { Project } from '$lib/types/project';
import type { Actions, PageServerLoad } from './$types';

type ProjectRow = {
	id: string;
	title: string;
	description: string;
	tech_stack: string;
	github_url: string;
	live_url: string;
	created_at: string;
};

const projectColumns = 'id, title, description, tech_stack, github_url, live_url, created_at';

function toProject(row: ProjectRow): Project {
	return {
		id: row.id,
		title: row.title,
		description: row.description,
		techStack: row.tech_stack,
		githubUrl: row.github_url,
		liveUrl: row.live_url,
		createdAt: row.created_at
	};
}

function readProjectFields(formData: FormData) {
	return {
		title: String(formData.get('title') ?? '').trim(),
		description: String(formData.get('description') ?? '').trim(),
		techStack: String(formData.get('techStack') ?? '').trim(),
		githubUrl: String(formData.get('githubUrl') ?? '').trim(),
		liveUrl: String(formData.get('liveUrl') ?? '').trim()
	};
}

export const load: PageServerLoad = async () => {
	const { data, error: databaseError } = await supabase
		.from('projects')
		.select(projectColumns)
		.order('created_at', { ascending: false });

	if (databaseError) {
		error(500, databaseError.message);
	}

	return {
		projects: (data as ProjectRow[]).map(toProject)
	};
};

export const actions: Actions = {
	create: async ({ request }) => {
		const fields = readProjectFields(await request.formData());

		if (!fields.title || !fields.description) {
			return fail(400, { message: 'Title and description are required' });
		}

		const { error: databaseError } = await supabase.from('projects').insert({
			id: crypto.randomUUID(),
			title: fields.title,
			description: fields.description,
			tech_stack: fields.techStack,
			github_url: fields.githubUrl,
			live_url: fields.liveUrl,
			created_at: new Date().toISOString()
		});

		if (databaseError) {
			return fail(500, { message: databaseError.message });
		}

		redirect(303, '/');
	},

	update: async ({ request }) => {
		const formData = await request.formData();
		const id = String(formData.get('id') ?? '');
		const fields = readProjectFields(formData);

		if (!id || !fields.title || !fields.description) {
			return fail(400, { message: 'Project, title and description are required' });
		}

		const { error: databaseError } = await supabase
			.from('projects')
			.update({
				title: fields.title,
				description: fields.description,
				tech_stack: fields.techStack,
				github_url: fields.githubUrl,
				live_url: fields.liveUrl
			})
			.eq('id', id);

		if (databaseError) {
			return fail(500, { message: databaseError.message });
		}

		redirect(303, '/');
	},

	delete: async ({ request }) => {
		const formData = await request.formData();
		const id = String(formData.get('id') ?? '');

		if (!id) {
			return fail(400, { message: 'Project ID is required' });
		}

		const { error: databaseError } = await supabase.from('projects').delete().eq('id', id);

		if (databaseError) {
			return fail(500, { message: databaseError.message });
		}

		redirect(303, '/');
	}
};
