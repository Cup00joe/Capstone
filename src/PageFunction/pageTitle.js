import './pageTitle.css';
import { homeText } from './text';

function pageTitle({ page }) {
    return (
        <div className="page_title-container">
            {page === "Home" ? (
                <>
                    <h1 className="page_header">Welcome to HBA Manager</h1>
                    <p className="text">
                        {homeText[0].text}
                    </p>
                    <hr></hr>
                </>
            ) : (
                <>
                <h3 className="page_title">{page}</h3>
                <hr></hr>
                </>
            )}
        </div>
    )
}

export default pageTitle;
