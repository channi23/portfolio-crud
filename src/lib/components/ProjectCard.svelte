<script lang="ts">
	import * as Card from '$lib/components/ui/card/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import type { Project } from '$lib/types/project';

	let {
		project,
		onEdit
	}: {
		project: Project;
		onEdit: (project: Project) => void;
	} = $props();
</script>

<Card.Root class="border-white bg-black text-white">
	<Card.Header>
		<Card.Title>{project.title}</Card.Title>
		<Card.Description class="text-gray-300">
			{project.description}
		</Card.Description>
	</Card.Header>

	<Card.Content class="space-y-4">
		<div>
			<p class="text-sm text-gray-400">Tech Stack</p>
			<p class="mt-1 text-sm font-medium text-white">{project.techStack}</p>
		</div>

		<div class="flex gap-3 text-sm">
			<a
				href={project.githubUrl}
				target="_blank"
				rel="external noopener noreferrer"
				data-sveltekit-reload
				class="underline underline-offset-4 hover:text-gray-300"
			>
				GitHub
			</a>

			<a
				href={project.liveUrl}
				target="_blank"
				rel="external noopener noreferrer"
				data-sveltekit-reload
				class="underline underline-offset-4 hover:text-gray-300"
			>
				Live Demo
			</a>
		</div>
	</Card.Content>

	<Card.Footer class="flex gap-3">
		<Button
			type="button"
			variant="outline"
			onclick={() => onEdit(project)}
			class="border-white bg-black text-white hover:bg-white hover:text-black"
		>
			Update
		</Button>

		<form method="POST" action="?/delete">
			<input type="hidden" name="id" value={project.id} />
			<Button
				type="submit"
				variant="outline"
				class="border-white bg-black text-white hover:bg-white hover:text-black"
			>
				Delete
			</Button>
		</form>
	</Card.Footer>
</Card.Root>
