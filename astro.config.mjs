// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

export default defineConfig({
  site: 'https://theg1.github.io',
  integrations: [
    starlight({
      title: "theG's Cloud",
      description: 'Cloud Solutions Architect',
      defaultLocale: 'root',
      locales: {
        root: {
          label: '한국어',
          lang: 'ko',
        },
      },
      social: {
        github: 'https://github.com/theG1/theG1.github.io',
      },
      sidebar: [
        {
          label: 'Cloud',
          autogenerate: { directory: 'cloud' },
        },
        {
          label: 'Kubernetes',
          autogenerate: { directory: 'k8s' },
        },
        {
          label: 'AI 개발',
          autogenerate: { directory: 'ai' },
        },
        {
          label: 'OpenShift (DO180)',
          autogenerate: { directory: 'openshift' },
        },
        {
          label: 'Shell Script',
          autogenerate: { directory: 'shell' },
        },
      ],
      customCss: ['./src/styles/custom.css'],
      editLink: {
        baseUrl:
          'https://github.com/theG1/theG1.github.io/edit/main/',
      },
      credits: true,
    }),
  ],
});
