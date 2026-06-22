import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ platform }) => {
	const db = platform?.env.DB;

	if (!db) {
		return { projects: [] };
	}

	const { results } = await db
		.prepare(
			`SELECT 
				id,
				title,
				description,
				tech_stack as techStack,
				github_url as githubUrl,
				live_url as liveUrl,
				created_at as createdAt
			FROM projects
			ORDER BY created_at DESC`
		)
		.all();

	return {
		projects: results
	};
};

export const actions: Actions = {
	create: async ({ request, platform }) => {
		const db = platform?.env.DB;
		if (!db) return fail(500, { message: 'D1 database binding not found' });

		const formData = await request.formData();

		const id = crypto.randomUUID();
		const title = String(formData.get('title') || '');
		const description = String(formData.get('description') || '');
		const techStack = String(formData.get('techStack') || '');
		const githubUrl = String(formData.get('githubUrl') || '');
		const liveUrl = String(formData.get('liveUrl') || '');
		const createdAt = new Date().toISOString();

		if (!title || !description) {
			return fail(400, { message: 'Title and description are required' });
		}

		await db
			.prepare(
				`INSERT INTO projects 
				(id, title, description, tech_stack, github_url, live_url, created_at)
				VALUES (?, ?, ?, ?, ?, ?, ?)`
			)
			.bind(id, title, description, techStack, githubUrl, liveUrl, createdAt)
			.run();

		throw redirect(303, '/');
	},

	delete: async ({ request, platform }) => {
		const db = platform?.env.DB;
		if (!db) return fail(500, { message: 'D1 database binding not found' });

		const formData = await request.formData();
		const id = String(formData.get('id') || '');

		await db.prepare('DELETE FROM projects WHERE id = ?').bind(id).run();

		throw redirect(303, '/');
	},

	update: async ({ request, platform }) => {
		const db = platform?.env.DB;
		if (!db) return fail(500, { message: 'D1 database binding not found' });

		const formData = await request.formData();

		const id = String(formData.get('id') || '');
		const title = String(formData.get('title') || '');
		const description = String(formData.get('description') || '');
		const techStack = String(formData.get('techStack') || '');
		const githubUrl = String(formData.get('githubUrl') || '');
		const liveUrl = String(formData.get('liveUrl') || '');

		await db
			.prepare(
				`UPDATE projects
				 SET title = ?, description = ?, tech_stack = ?, github_url = ?, live_url = ?
				 WHERE id = ?`
			)
			.bind(title, description, techStack, githubUrl, liveUrl, id)
			.run();

		throw redirect(303, '/');
	}
};