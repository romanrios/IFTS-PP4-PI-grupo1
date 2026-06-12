import "./TitleBar.css";

function TitleBar({ title }) {
    return (
        <div className="titleBar">
            <h2 className="titleBar__title">{title}</h2>
        </div>
    );
}

export default TitleBar;