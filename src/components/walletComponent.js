import React, { useEffect, useState } from "react";

const WalletComponent = (props) => {

    const [wallet, setWallet] = useState('');
    const [err, setError] = useState('');

    useEffect(() => {

        setWallet(props?.row?.[props?.inputkey])
    }, [props?.row?.[props?.inputkey]]);


    const handleInputChange = (event, key) => {
        const { value } = event.target;
        setWallet(value)
    };

    const handleSave = () => {
        debugger
        if (props.inputkey === 'optimal_value' && parseInt(wallet) > parseInt(props?.state?.points?.allocated_value)) {
            setError('Enter the least allocated value for optimal performance.')
            return
        } else if (props.inputkey === 'allocated_value' && parseInt(props?.state?.points?.optimal_value) > parseInt(wallet)) {
            setError('Enter the optimal value for allocated performance.')
            return
        } else {
            setError('')
            props?.addWalletPoints({ [props.inputkey]: wallet }, props?.row)
        }
    }

    return (
        <React.Fragment>
            <div style={{display:'flex',alignItems:'center'}}>
            <input  value={wallet} type="text" className="tableinput form-control field-input" onChange={(e) => handleInputChange(e, 'optimal_value')} />
            <div className="tableButton ml-1">
            <button className="eep-btn eep-btn-success"  onClick={handleSave}>Save</button>
            {err && <label style={{ fontSize: 11, color: "red" }}>{err}</label>}
            </div>
            </div>
           
        </React.Fragment>
    );
};
export default WalletComponent;