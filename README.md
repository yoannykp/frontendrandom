# Next.js shadcn/ui Boilerplate

This is a Next.js boilerplate with a collection of tools and configurations for a streamlined developer experience. This template includes essential packages like Radix UI, Tailwind CSS, ESLint, Prettier, Husky, Commitlint, and TypeScript, offering a solid starting point for modern web development.

## Features

- **Next.js 14** for server-side rendering and static site generation.
- **TypeScript** support out of the box.
- **Tailwind CSS** for rapid UI development with **Tailwind Merge** to merge classnames easily.
- **Radix UI Icons** and **Lucide Icons** for accessible and customizable icons.
- **Prettier** and **ESLint** for linting and code formatting, integrated with Tailwind CSS plugin for styling consistency.
- **Husky** and **Lint-Staged** for pre-commit hooks to ensure code quality.
- **Commitlint** for enforcing conventional commits.
- **Next Themes** for dark/light mode support.
- **Sharp** for image optimization.

## Getting Started

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/Nalikes-Studio/nextjs-shadcn-ui-boilerplate.git [your-project-name]
   cd [your-project-name]
   ```

2. Install the dependencies:

   ```bash
   yarn install
   ```

3. Run the development server:

   ```bash
   yarn dev
   ```

   Open [http://localhost:3000](http://localhost:3000) to see your application.

### Scripts

- `yarn dev`: Starts the development server.
- `yarn build`: Builds the application for production.
- `yarn start`: Starts the production build.
- `yarn lint`: Runs ESLint to lint your code.
- `yarn prepare`: Installs Husky pre-commit hooks.

### Project Structure

- `app/(pages)/`: Next.js pages.
- `app/styles/`: Global styles and Tailwind CSS configuration.
- `components/`: Reusable UI components.
- `public/`: Static files like images.

### Husky & Commitlint

This boilerplate enforces consistent commit messages using [Commitlint](https://commitlint.js.org/) and [Husky](https://typicode.github.io/husky/). You can configure your commit message rules in the `.commitlint.config.ts` file.

To install the pre-commit hooks, run:

```bash
yarn prepare
```

This will install Husky and set up Git hooks to run lint-staged and commitlint on every commit.

### Linting & Formatting

- ESLint is used for JavaScript/TypeScript linting.
- Prettier formats code, and it’s integrated with a plugin to sort imports automatically.
- Tailwind CSS is integrated with a Prettier plugin to keep Tailwind classes consistent.

```bash
yarn lint
```

### Styling

This project uses Tailwind CSS for styling. You can add your custom styles in the `app/styles` folder and extend the Tailwind configuration in `tailwind.config.ts`.

### Commit Message Guidelines

This project uses conventional commits. Here's a basic commit message format:

```bash
<type>(scope?): <description>
```

**Example:**

```scss
feat(button): add primary button component;
```

### Dark Mode Support

The boilerplate includes Next Themes for handling dark and light mode.
