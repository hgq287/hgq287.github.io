function Copyright({ year = new Date().getFullYear(), name = 'Hg Q' }) {
  return (
    <footer className="mt-16 pt-8 border-t border-divider">
      <p className="text-sm text-text-secondary">
        &copy; {year} {name}. All rights reserved.
      </p>
    </footer>
  );
}

export default Copyright;