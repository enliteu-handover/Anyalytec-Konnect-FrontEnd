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
            <input value={wallet}
                onChange={(e) => handleInputChange(e, 'optimal_value')} />
            <button onClick={handleSave}>Save</button>
        </React.Fragment>
    );
};
export default WalletComponent;