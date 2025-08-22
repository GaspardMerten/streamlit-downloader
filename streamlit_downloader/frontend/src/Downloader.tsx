import {ComponentProps, Streamlit, withStreamlitConnection,} from "streamlit-component-lib"
import React, {ReactElement, useCallback, useEffect} from "react"

/**
 * A component that triggers an automatic download on initialization.
 *
 * This component handles the download of data passed from Streamlit's Python backend.
 * It creates a Blob from the provided data and initiates a download, making it
 * useful for automatically providing files to the user when the component loads.
 *
 * @param {ComponentProps} props - The props object passed from Streamlit.
 * @param {Object} props.args - Custom arguments passed from the Python side.
 * @param {string} props.args.data - The data to be downloaded, typically as a string or byte-like object.
 * @param {string} props.args.filename - The desired filename for the downloaded file.
 * @param {string} props.args.content_type - The MIME type of the data (e.g., 'text/csv', 'application/pdf').
 * @param {boolean} props.disabled - Whether the component is in a disabled state (not used for this component).
 * @param {Object} props.theme - Streamlit theme object for consistent styling (not used for this component).
 * @returns {ReactElement} The rendered component, which is visually hidden.
 */
function Downloader({args, disabled, theme}: ComponentProps): ReactElement {
    // Extract custom arguments passed from Python
    const {data, filename, content_type} = args;

    // Trigger download
    async function triggerDownload() {
        const blob = new Blob([data], { type: content_type });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        Streamlit.setComponentValue(1);
    }

    useEffect(() => {
      triggerDownload().then();
      Streamlit.setFrameHeight(0);
    }, []);

    return (
        <div style={{visibility: "hidden", height: 0, width: 0, padding: 0, margin: 0}}/>
    )
}

/**
 * withStreamlitConnection is a higher-order component (HOC) that:
 * 1. Establishes communication between this component and Streamlit
 * 2. Passes Streamlit's theme settings to your component
 * 3. Handles passing arguments from Python to your component
 * 4. Handles component re-renders when Python args change
 *
 * You don't need to modify this wrapper unless you need custom connection behavior.
 */
export default withStreamlitConnection(Downloader)