import React, { useEffect, useState } from "react";

const WalletComponent = (props) => {

    const [wallet, setWallet] = useState('');

    useEffect(() => {
        
        setWallet(props?.row?.[props?.inputkey])
    }, [props?.row?.[props?.inputkey]]);


    const handleInputChange = (event, key) => {
        const { value } = event.target;
        setWallet(value)
    };

    const handleSave = () => {
        props?.addWalletPoints({ [props.inputkey]: wallet }, props?.row)
    }

    return (
        <React.Fragment>
            <div style={{display:'flex',alignItems:'center'}}>
            <input  value={wallet} type="text" className="tableinput form-control field-input" onChange={(e) => handleInputChange(e, 'optimal_value')} />
            <div className="tableButton ml-1">
            <button className="eep-btn eep-btn-success"  onClick={handleSave}>Save</button>
            </div>
            </div>

        </React.Fragment>
    );
};
export default WalletComponent;