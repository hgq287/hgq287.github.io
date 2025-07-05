function Copyright({ year = new Date().getFullYear(), company = "Hg Q" }) {
  return (
    <p
      style={{
        fontSize: '0.9rem',
        color: '#555',          
        fontWeight: 300,        
        textAlign: 'right',
        margin: '1rem 0'
      }}
    >
      &copy; {year} {company}. All rights reserved.
    </p>
  );
}

export default Copyright;