import { LinkCard } from '../components/LinkCard';

const profileHooks = [
  {
    label: 'useCreateProfile',
    description: `Create a profile.`,
    path: '/profiles/useCreateProfile',
  },
];

export function ProfilesPage() {
  return (
    <div>
      <h1>Profiles</h1>

      {profileHooks.map((link) => (
        <LinkCard key={link.path} {...link} />
      ))}
    </div>
  );
}
