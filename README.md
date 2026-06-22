# Portfolio CRUD: One Application, Three Architectures

The main goal of this project was not just to build another CRUD application.

As someone who spends most of his time working with APIs, databases and backend systems, frontend frameworks initially felt like a different world. I used this project to understand how a modern full-stack frontend framework is structured from the browser all the way to deployment.

The CRUD operations stayed the same: create, read, update and delete a portfolio project. What changed was where the data lived, where the server code ran and how the application communicated with the database.

I built the project in three stages:

1. SvelteKit with browser `localStorage`
2. SvelteKit on Cloudflare with D1
3. SvelteKit on Vercel with Supabase

This helped me understand that a modern web application is not only frontend code. The same UI can run on different platforms and use completely different persistence and security models.

## Project Branches

| Branch            | Application runtime      | Persistence         |
| ----------------- | ------------------------ | ------------------- |
| `main`            | Browser and SvelteKit    | `localStorage`      |
| `cloudflare-d1`   | Cloudflare Pages/Workers | Cloudflare D1       |
| `vercel-supabase` | Vercel Functions         | Supabase PostgreSQL |

Cloudflare deployment: [cloudflare-d1.portfolio-crud.pages.dev](https://cloudflare-d1.portfolio-crud.pages.dev/)

## Technology Used

- Svelte 5, SvelteKit and TypeScript
- Tailwind CSS and shadcn-svelte
- Bun
- Cloudflare Pages, Workers and D1
- Vercel Functions
- Supabase and PostgreSQL

## Understanding Svelte and SvelteKit

One of my first confusions was understanding the difference between Svelte and SvelteKit.

The easiest way I can explain it is:

- Svelte is the UI framework.
- SvelteKit is the full-stack application framework built on top of Svelte.

Svelte helps build components and reactive interfaces. SvelteKit adds the application structure around them:

- File-based routing
- Server-side rendering
- Static generation
- Server load functions and form actions
- Deployment adapters
- A standard project structure

Coming from backend development with NestJS, this felt familiar. NestJS provides structure around Node.js server development, while SvelteKit provides structure around Svelte applications.

## Understanding File-Based Routing

In many backend frameworks, routes are registered manually:

```ts
router.get('/projects');
router.get('/users');
```

SvelteKit uses the filesystem as the routing configuration.

```text
src/routes/+page.svelte
```

becomes:

```text
/
```

and:

```text
src/routes/projects/+page.svelte
```

becomes:

```text
/projects
```

Files such as `+page.server.ts` then add server-only loading and actions for the same route. This reduces routing boilerplate and keeps the page, its data loading and its server operations close together.

## Understanding Components and Responsibilities

Technically, I could have placed the entire application in one page. That would work for a small demo, but it would become difficult to maintain as the application grew.

I separated the interface into components:

```text
ProjectForm.svelte
ProjectCard.svelte
```

`ProjectForm` collects project information. `ProjectCard` displays one project and provides its available actions.

This reinforced a familiar engineering principle: each component should have a clear responsibility.

## Understanding Parent and Child Communication

The page coordinates the workflow and passes data into child components.

For example:

```svelte
<ProjectCard {project} onEdit={startEdit} />
```

The card receives those values through Svelte 5 props:

```ts
let { project, onEdit } = $props();
```

In the localStorage version, the parent page owned the project state and callbacks changed that state. In the database versions, native forms submit to SvelteKit server actions. This showed me that component boundaries can remain stable even when data ownership moves from the browser to the server.

## Understanding State and Reactivity

State is data that changes while the application is running.

```ts
let projects = $state<Project[]>([]);
let editingProject = $state<Project | null>(null);
```

Creating, updating or deleting a project changes application state, and Svelte updates the interface in response.

The important progression in this project was understanding two kinds of state:

- Client state, such as which project is currently being edited
- Persistent server data, such as the projects stored in D1 or PostgreSQL

Not every changing value belongs in a database, and not every important value should exist only in browser memory.

## Understanding shadcn-svelte

This was my first time using shadcn-svelte.

I initially thought of it as a normal component library. It is more accurate to think of it as a component system: the generated component source becomes part of the application instead of remaining hidden inside a dependency.

That gives me more control over styling and behavior while still providing accessible component foundations.

## Understanding SSR and Rendering

SvelteKit also introduced me to different rendering strategies.

Server-side rendering generates the page HTML on the server for a request. Static generation creates HTML during the build. Client-side code then makes the rendered page interactive.

This project uses server load functions for database-backed versions, allowing the initial project list to be loaded before the page reaches the browser. Understanding this made deployment feel less magical because I could identify which code ran during the build, inside the server runtime or inside the browser.

## Stage 1: localStorage

The first version stored projects inside the browser.

```text
Browser -> Svelte state -> localStorage
```

This was useful for learning components, props, forms, runes and state management without introducing a backend too early.

```ts
export function saveProject(projects: Project[]): void {
	localStorage.setItem('portfolio-projects', JSON.stringify(projects));
}
```

The limitation is that the data belongs to one browser. It is not shared between devices, and clearing browser storage removes it.

## Stage 2: Cloudflare and D1

The second version moved persistence to the server.

```text
Browser -> SvelteKit form action -> Cloudflare Worker -> D1 binding -> D1
```

D1 is Cloudflare's managed serverless database with SQLite-compatible SQL semantics. Cloudflare injects the database into the runtime:

```ts
const db = platform?.env.DB;
```

The application talks to D1 using prepared SQL:

```ts
await db
	.prepare(
		`INSERT INTO projects
		(id, title, description, tech_stack, github_url, live_url, created_at)
		VALUES (?, ?, ?, ?, ?, ?, ?)`
	)
	.bind(id, title, description, techStack, githubUrl, liveUrl, createdAt)
	.run();
```

The important concept is the platform binding. The application does not need a public database URL or key. Cloudflare provides the `DB` resource directly to the Worker environment.

This version taught me about direct SQL, migrations, local versus remote databases, bindings and preview versus production configuration.

## Stage 3: Vercel and Supabase

The third version kept the SvelteKit server actions but changed both the runtime and database provider.

```text
Browser -> SvelteKit form action -> Vercel Function -> Supabase Data API -> PostgreSQL
```

Supabase is a backend platform built around PostgreSQL. It also provides authentication, storage, realtime functionality, generated APIs and Row Level Security integration.

The application connects using environment variables:

```env
PUBLIC_SUPABASE_URL=https://your-project.supabase.co
PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
```

Instead of writing the INSERT statement directly, the application uses the Supabase client:

```ts
const { error: databaseError } = await supabase.from('projects').insert({
	id: crypto.randomUUID(),
	title,
	description,
	tech_stack: techStack,
	github_url: githubUrl,
	live_url: liveUrl,
	created_at: new Date().toISOString()
});
```

This is not exactly an ORM. The Supabase client is a query builder communicating with a generated Data API in front of PostgreSQL.

This version taught me about the Vercel adapter, connecting separate platforms, environment variables, PostgreSQL, generated APIs and Row Level Security.

## D1 and Supabase Compared

| Area                  | Cloudflare D1                      | Supabase                                              |
| --------------------- | ---------------------------------- | ----------------------------------------------------- |
| Database              | SQLite-compatible                  | Full PostgreSQL                                       |
| Application host here | Cloudflare Pages/Workers           | Vercel Functions                                      |
| Connection            | `platform.env.DB` binding          | HTTPS API with URL and publishable key                |
| Query style           | Direct prepared SQL                | Supabase query builder/Data API                       |
| Configuration         | `wrangler.jsonc` and bindings      | Environment variables and project settings            |
| Authorization focus   | Server actions protect the binding | PostgreSQL roles and Row Level Security               |
| Coupling              | Cloudflare-specific D1 API         | Standard PostgreSQL, plus Supabase-specific API usage |
| Extra capabilities    | Wider Cloudflare platform          | Auth, Storage, Realtime and Edge Functions            |

Neither option is automatically better.

D1 gives a direct Cloudflare-native path from server code to SQL. Supabase provides a broader backend platform and PostgreSQL. Performance depends on regions, query patterns, caching and network topology, so an extra network hop alone does not decide which one is faster.

## What Stayed the Same

The form still submits the same project fields:

```svelte
<form method="POST" action={editingProject ? '?/update' : '?/create'}>
	<input name="title" />
	<textarea name="description"></textarea>
	<button type="submit">Save Project</button>
</form>
```

The components do not need to know whether the server writes to D1 or Supabase. They only know which SvelteKit action receives the form.

```text
UI -> collect and display data
Server -> validate requests and coordinate persistence
Database -> store data and enforce database rules
```

This separation is one of the biggest lessons from the project.

## Security Lesson

With D1, the binding only exists inside the Cloudflare runtime. A visitor cannot directly obtain `platform.env.DB`, but public form actions still need authorization if only an administrator should modify projects.

With Supabase, a publishable key identifies the project but does not grant unrestricted access by itself. Row Level Security policies decide what the `anon` and `authenticated` roles can do.

The Supabase branch currently allows anonymous writes because this is a learning project. A real portfolio admin system should add authentication and restrict writes to an authenticated administrator.

## Running the Project

```sh
bun install
bun run dev
```

Switch between implementations with:

```sh
git switch main
git switch cloudflare-d1
git switch vercel-supabase
```

For the Supabase branch, create an ignored `.env.local`:

```env
PUBLIC_SUPABASE_URL=https://your-project.supabase.co
PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
```

Run `bun install` again after switching branches because their dependencies and adapters differ.

## Deployment Lessons

The Cloudflare deployment required:

- The Cloudflare adapter
- A D1 database and migration
- A binding named exactly `DB`
- A Pages-compatible `wrangler.jsonc`
- Awareness of local, preview and remote resources

The Vercel deployment required:

- The Vercel adapter
- Supabase variables in the correct Vercel environment
- A PostgreSQL table with matching columns
- RLS policies for operations allowed through the publishable key
- A new deployment after changing environment variables

Many errors were not application-logic errors. They came from missing bindings, tables, variables or policies. Identifying which layer failed was as important as writing the CRUD code.

## What I Actually Learned

I started with a simple CRUD application, but the project covered much more:

- Svelte components, props and runes
- SvelteKit routing, SSR, load functions and form actions
- Browser state versus server state
- SQLite semantics and PostgreSQL
- Direct SQL versus a generated Data API
- Migrations and schema management
- Platform bindings and environment variables
- Row Level Security
- Git branches and preview deployments
- Cloudflare and Vercel deployment models
- Debugging across frontend, server, database and infrastructure layers


## Useful Documentation

- [SvelteKit](https://svelte.dev/docs/kit)
- [Cloudflare D1](https://developers.cloudflare.com/d1/)
- [Cloudflare Pages bindings](https://developers.cloudflare.com/pages/functions/bindings/)
- [Supabase architecture](https://supabase.com/docs/architecture)
- [Supabase Row Level Security](https://supabase.com/docs/guides/database/postgres/row-level-security)
- [SvelteKit on Vercel](https://vercel.com/docs/frameworks/full-stack/sveltekit)
