import { ReactSVG } from 'react-svg';
const SvgComponent = ({svgUrl}) => {
    return <ReactSVG
        src={svgUrl}
        beforeInjection={(svg) => {
            svg.setAttribute('width', '200');
            svg.setAttribute('height', '200');
            svg.setAttribute('display', 'flex');
        }}
    />
}

export default SvgComponent;