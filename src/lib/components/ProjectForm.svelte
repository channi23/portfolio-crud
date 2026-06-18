<script lang="ts">
	import type { Project } from '$lib/types/project';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Textarea } from '$lib/components/ui/textarea/index.js';

	let {
		onAddProject,
		onUpdateProject,
		editingProject
	}: {
		onAddProject: (project: Project) => void;
		onUpdateProject: (project: Project) => void;
		editingProject: Project | null;
	} = $props();

	const emptyForm = () => ({
		title: '',
		description: '',
		techStack: '',
		githubUrl: '',
		liveUrl: ''
	});

	let formData = $state(emptyForm());

	$effect(() => {
		if (editingProject) {
			formData = {
				title: editingProject.title,
				description: editingProject.description,
				techStack: editingProject.techStack,
				githubUrl: editingProject.githubUrl,
				liveUrl: editingProject.liveUrl
			};
		}
	});

	function handleSubmit() {
		const project: Project = {
			id: editingProject?.id ?? crypto.randomUUID(),
			...formData,
			createdAt: editingProject?.createdAt ?? new Date().toISOString()
		};

		if (editingProject) {
			onUpdateProject(project);
		} else {
			onAddProject(project);
		}

		formData = emptyForm();
	}
</script>

<form
	class="space-y-5"
	onsubmit={(event) => {
		event.preventDefault();
		handleSubmit();
	}}
>
	<div class="space-y-2">
		<label for="title" class="block text-sm font-medium text-gray-200">Project Title</label>
		<Input
			id="title"
			bind:value={formData.title}
			placeholder="Portfolio Website"
			class="border-white bg-black text-white placeholder:text-gray-500"
		/>
	</div>

	<div class="space-y-2">
		<label for="description" class="block text-sm font-medium text-gray-200">Description</label>
		<Textarea
			id="description"
			bind:value={formData.description}
			placeholder="Briefly describe what this project does"
			rows={4}
			class="border-white bg-black text-white placeholder:text-gray-500"
		/>
	</div>

	<div class="space-y-2">
		<label for="tech-stack" class="block text-sm font-medium text-gray-200">Tech Stack</label>
		<Input
			id="tech-stack"
			bind:value={formData.techStack}
			placeholder="SvelteKit, Tailwind CSS, localStorage"
			class="border-white bg-black text-white placeholder:text-gray-500"
		/>
	</div>

	<div class="space-y-2">
		<label for="github-url" class="block text-sm font-medium text-gray-200">GitHub URL</label>
		<Input
			id="github-url"
			type="url"
			bind:value={formData.githubUrl}
			placeholder="https://github.com/username/project"
			class="border-white bg-black text-white placeholder:text-gray-500"
		/>
	</div>

	<div class="space-y-2">
		<label for="live-url" class="block text-sm font-medium text-gray-200">Live URL</label>
		<Input
			id="live-url"
			type="url"
			bind:value={formData.liveUrl}
			placeholder="https://your-project.com"
			class="border-white bg-black text-white placeholder:text-gray-500"
		/>
	</div>

	<Button type="submit" class="w-full bg-white text-black hover:bg-gray-200">
		{editingProject ? 'Update Project' : 'Add Project'}
	</Button>
</form>