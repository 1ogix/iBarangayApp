interface PageHeaderProps {
  title: string;
  description?: string;
}

export function PageHeader({ title, description }: PageHeaderProps) {
  return (
    <header className="border-b pb-4">
      <h1 className="text-3xl font-bold">{title}</h1>
      {description && (
        <p className="mt-2 max-w-2xl text-base text-muted-foreground">{description}</p>
      )}
    </header>
  );
}
