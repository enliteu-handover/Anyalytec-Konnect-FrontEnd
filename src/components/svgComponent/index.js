const SvgComponent = (svgUrl) => {
    return (
        <svg>
            <img src={svgUrl} width="500" height="500" />
        </svg>
        //  <div dangerouslySetInnerHTML={{ __html: svgUrl }} />
    );
}

export default SvgComponent;