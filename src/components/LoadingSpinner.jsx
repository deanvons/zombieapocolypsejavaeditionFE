export default function LoadingSpinner() {
  return (
    <div className="flex justify-center py-16" role="status">
      <div className="h-10 w-10 rounded-full border-4 border-border border-t-primary animate-spin" />
      <span className="sr-only">Loading...</span>
    </div>
  );
}
