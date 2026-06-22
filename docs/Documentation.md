# Learning SvelteKit Through the Eyes of a Backend Engineer

The major objective of this project was not to build a fancy portfolio website. The actual goal was to understand how a modern full-stack frontend framework works.

As someone who spends most of his time working with APIs, databases and backend systems, frontend development always felt like a completely different world. I could build websites before, but I never really understood how modern frontend frameworks were wired internally.

This is where SvelteKit came into the picture.

I decided to build a simple CRUD application using SvelteKit, Tailwind CSS, ShadCN and localStorage. The application itself was intentionally simple because I wanted to focus more on learning the framework than building business logic.

After spending time building the project, fixing errors, understanding the project structure and eventually deploying it to Vercel and Cloudflare, I realized that I had learned much more than just CRUD operations.

## Understanding Svelte vs SvelteKit

One of the first confusions I had was understanding the difference between Svelte and SvelteKit.

The easiest way I can explain it is this:

- Svelte is the UI framework.
- SvelteKit is the full-stack framework built on top of Svelte.

Think of Svelte as the engine and SvelteKit as the complete car.

Svelte helps us build components.

SvelteKit provides:

- Routing
- Server Side Rendering
- Static Site Generation
- API support
- Deployment adapters
- Project structure

Coming from NestJS, this felt familiar. Just like NestJS provides structure around Node.js and Express, SvelteKit provides structure around Svelte.

## Understanding File-Based Routing

One of the first concepts that immediately stood out to me was File-Based Routing.

In many frameworks, routes are manually configured.

For example, we may write something like:

```ts
router.get('/projects')
router.get('/users')
```

SvelteKit takes a different approach.

The folder structure itself becomes the routing configuration.

For example:

```text
src/routes/+page.svelte
```

Automatically becomes:

```text
/
```

Similarly:

```text
src/routes/projects/+page.svelte
```

Automatically becomes:

```text
/projects
```

This was one of the first moments where I felt the framework was trying to reduce boilerplate and improve developer experience.

## Understanding Components (If you already know skip it!, Just providing information)

The next concept I learned was Components.

Initially, I wondered why I could not simply put everything into a single page.

Technically, I could.

However, as applications grow, maintaining one large file quickly becomes difficult.

A component is simply a reusable piece of UI.

For my project, I created:

```text
ProjectForm.svelte
ProjectCard.svelte
```

Each component had a specific responsibility.

ProjectForm was responsible for collecting user input.

ProjectCard was responsible for displaying project information.

This is an important engineering principle:

A component should ideally have a single responsibility.

## Understanding Parent and Child Communication

After creating multiple components, the next question is:

How do these components talk to each other?

This is where Parent and Child communication comes into play.

The parent component owns the data.

The child component receives data and displays it.

For example:

```svelte
<ProjectCard project={project} />
```

The page passes the project object into the card component.

Inside the card component:

```svelte
let { project } = $props();
```

This was one of the cleanest concepts to learn because it creates a predictable flow of data.

The parent manages state.

The child focuses on presentation.

## Understanding State (If you already know skip it!, Just providing information)

State is simply data that changes during the lifetime of an application.

For example:

```ts
let projects = [];
```

The moment a user:

- Creates a project
- Updates a project
- Deletes a project

The data changes.

That changing data becomes application state.

One thing I liked about Svelte is that state management feels very natural compared to some other frameworks.

When state changes, the UI automatically reacts.

## Understanding localStorage

For persistence, I intentionally used localStorage.

The reason was simple.

I wanted to focus on learning the framework before introducing databases.

Saving data looked something like:

```ts
localStorage.setItem('projects', JSON.stringify(projects));
```

Loading data looked like:

```ts
const projects = JSON.parse(localStorage.getItem('projects') || '[]');
```

localStorage is useful for learning.

However, it is not suitable for real-world applications because:

- Data exists only in the browser
- Data is not shared across devices
- Querying is limited
- Security is minimal

This understanding becomes important because the next version of this project will replace localStorage with Cloudflare D1 and Supabase.

## Understanding ShadCN (It was my first time using it)

Another concept I learned was ShadCN.

Initially, I assumed it was a component library.

After using it, I realized it is more accurately described as a component system.

Instead of relying entirely on external UI frameworks, ShadCN provides components that become part of your own codebase.

This gives developers much more control over customization.

## Understanding SSR, Static Rendering and Modern Deployment

While working through deployment, I also learned about different rendering strategies.

Server Side Rendering (SSR) generates HTML on the server before sending it to the browser.

Static Rendering generates pages during build time.

Modern frameworks like SvelteKit allow developers to choose the most appropriate strategy depending on the application's requirements.

Understanding these concepts made deployment feel less magical and more logical.

## Deployment Experience

The final step was deployment.

I deployed the project to Vercel and Cloudflare.

This exposed me to concepts such as:

- Build pipelines
- Deployment adapters
- Environment configuration
- Platform-specific deployment requirements


## Final Thoughts

If I had to summarize my biggest takeaway from this project, it would be this:

Building a simple application is often the fastest way to understand a framework.

I started this project with almost no SvelteKit knowledge.

By the end of it, I understood routing, components, props, state management, persistence, UI systems, rendering strategies and deployment workflows.

The CRUD application itself was small.

The concepts learned while building it were much larger.

The next step in my learning journey is replacing localStorage with Cloudflare D1 and Supabase, comparing the developer experience of both platforms and understanding how modern applications evolve from browser-based storage into real databases.