export default ({name, email, number}) => {
    const [firstName, lastName] = name.split(' ');
    return (
        <header>
            <address>
                {email}
                <a href={`tel:+44${number}`}>(44) ${number}</a>
            </address>
            <details>
                <h1>
                    {firstName}<em>{lastName}</em>
                </h1>
            </details>
        </header>
    );
}