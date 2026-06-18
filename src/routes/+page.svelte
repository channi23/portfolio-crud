<script lang="ts">
	import { onMount } from 'svelte';
	import ProjectForm from '$lib/components/ProjectForm.svelte';
	import ProjectCard from '$lib/components/ProjectCard.svelte';
	import type { Project } from '$lib/types/project';
	import { loadProject, saveProject } from '$lib/storage/projectStorage';

	let projects = $state<Project[]>([]);
	let editingProject = $state<Project | null>(null);

	onMount(() => {
		projects = loadProject();
	});

	function addProject(project: Project) {
		projects = [project, ...projects];
		saveProject(projects);
	}

	function deleteProject(id: string) {
		projects = projects.filter((project) => project.id !== id);
		saveProject(projects);
	}

	function startEdit(project: Project) {
		editingProject = project;
	}

	function updateProject(updatedProject: Project) {
		projects = projects.map((project) =>
			project.id === updatedProject.id ? updatedProject : project
		);
		saveProject(projects);
		editingProject = null;
	}
</script>

<main class="min-h-screen bg-black px-6 py-10 text-white">
	<section class="mx-auto max-w-6xl">
		<div class="mb-8 border-b border-white pb-4">
			<h1 class="text-4xl font-bold">Portfolio CRUD</h1>
			<p class="mt-2 text-gray-300">
				Create, update, delete and manage portfolio projects.
			</p>
		</div>

		<div class="grid gap-8 lg:grid-cols-[380px_1fr]">
			<section class="rounded-lg border border-white bg-black p-6">
				<h2 class="mb-4 text-xl font-semibold">
					{editingProject ? 'Update Project' : 'Add Project'}
				</h2>

				<ProjectForm
					onAddProject={addProject}
					onUpdateProject={updateProject}
					editingProject={editingProject}
				/>
			</section>

			<section>
				<div class="mb-4 flex items-center justify-between">
					<h2 class="text-xl font-semibold">Projects</h2>
					<p class="text-gray-400">{projects.length} total</p>
				</div>

				{#if projects.length === 0}
					<div class="rounded-lg border border-dashed border-gray-500 p-8 text-center text-gray-400">
						No projects added yet.
					</div>
				{:else}
					<div class="grid gap-4 md:grid-cols-2">
						{#each projects as project (project.id)}
							<ProjectCard project={project} onDelete={deleteProject} onEdit={startEdit} />
						{/each}
					</div>
				{/if}
			</section>
		</div>
	</section>
</main>