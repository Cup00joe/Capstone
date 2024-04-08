import './Form.css';
import { useState, useEffect } from 'react'
import DropdownMenu from '../DropdownMenu/DropdownMenu';
import ContactButton from '../AddContactsButton/AddContactsButton';

// Enum for categories for customers
const customerCategory = Object.freeze({

    title: 0, firstName: 1, middleName: 2, lastName: 3, suffix: 4, displayName: 5,  // Full Name
    mainPhone: 6, workPhone: 7, mobilePhone: 8, email: 9, CCEmail: 10, fax: 11,     // Contact
    s_streetAddress: 12, s_city: 13, s_state: 14, s_zipCode: 15,                    // Shipping Address
    b_streetAddress: 16, b_city: 17, b_state: 18, b_zipCode: 19,                    // Billing Address
    webOrderId: 20, quickbooksId: 21, notes: 22,                                    // Additional Details & Notes
});

// Enum for categories for riders
const riderCategory = Object.freeze({

    name: 0, weight: 1,
});

// Rider Object
const Rider = (instanceId=Date.now(), name='', weight=0, mainPhone='', workPhone='', mobilePhone='', email='', CCEmail='', fax='') => {
    return {
        instanceId: instanceId,
        name: name,
        weight: weight,
        mainPhone: mainPhone,
        workPhone: workPhone,
        mobilePhone: mobilePhone,
        email: email,
        CCEmail: CCEmail,
        fax: fax
    }
}

function Form() {
    const [customer, updateCustomer] = useState({
        title: '', firstName: '', middleName: '', lastName: '', suffix: '', displayName: '',  // Full Name
        mainPhone: '', workPhone: '', mobilePhone: '', email: '', CCEmail: '', fax: '',       // Contact
        s_streetAddress: '', s_city: '', s_state: '', s_zipCode: '',                          // Shipping Address
        b_streetAddress: '', b_city: '', b_state: '', b_zipCode: '',                          // Billing Address
        webOrderId: '', quickbooksId: '', notes: '',  
    });

    const [text, setText] = useState('');
    const [customerIsRider, setCustomerAsRider] = useState(false);
    const [numOfRiders, setNumOfRiders] = useState(0);
    const [listOfRiders, appendRider] = useState([]);
    const [toUpdateList, toggleUpdateList] = useState(false);

    // Contact Fields
    /*const [mainPhone, setMainPhone] = useState('');
    const [workPhone, setWorkPhone] = useState('');
    const [mobilePhone, setMobilePhone] = useState('');
    const [email, setEmail] = useState('');
    const [CCEmail, setCCEmail] = useState('');
    const [fax, setFax] = useState('');*/
    

    useEffect(() => {

        console.log(numOfRiders);
        console.log(...listOfRiders);
        console.log("USE_EFFECT____________________");
        showRiderRows();
        toggleUpdateList(false);
    }, [numOfRiders, listOfRiders, toUpdateList]);

    const handleSubmit = async(event) => {

        event.preventDefault();
    }

    const handleCustomerRiderToggle = () => {

        setCustomerAsRider(!customerIsRider);
        //if (customerIsRider) {

        //}
    }

    const deleteRider = (idx) => {
        return function() {
            setNumOfRiders(numOfRiders - 1);
            if (idx > -1) {
                listOfRiders.splice(idx, 1);
            }
        }
    }

    const addRider = () => {

        console.log("ADDED");
        setNumOfRiders(numOfRiders + 1);
        appendRider([...listOfRiders, Rider()]);
    }

    const showRiderRows = () => {

        const arr = [];
        for (let i = 0; i < numOfRiders; ++i) {

            arr.push(
                //add key to <tr> soon
                <tr>
                    <th scope="row">{i + 1}</th>
                    <td><input type="text" value={listOfRiders[i].name} onChange={event => handleRiderUpdate(i, event, riderCategory.name)}></input></td>
                    <td><input type="number" value={listOfRiders[i].weight === 0 ? '' : listOfRiders[i].weight} onChange={event => handleRiderUpdate(i, event, riderCategory.weight)}></input></td>
                    <td className="form-body-wrapper_flex-row">
                        <ContactButton id={i + 1} person={listOfRiders[i]} toggleUpdate={toggleUpdateList}/>
                        <button className="delete-button" onClick={ deleteRider(i) }>Ｘ</button>
                    </td>
                </tr>
            )
        }
        return arr;
    }

    // CUSTOMER METHODS
    const handleCustomerUpdate = (event, category) => {

        switch (category) {
            case 0:
                break;
            case 1:
                break;
            case 2:
                break;
            case 3:
                break;
            case 4:
                break;
            case 5:
                break;
            case 6:
                updateMainPhone(event);
                break;
            case 7:
                break;
            case 8:
                break;
            case 9:
                break;
            case 10:
                break;
            case 11:
                break;
            case 12:
                break;
            case 13:
                break;
            case 14:
                break;
            case 15:
                break;
            case 16:
                break;
            case 17:
                break;
            case 18:
                break;
            case 19:
                break;
            case 20:
                break;
            case 21:
                break;
            case 22:
                break;
        }
    }

    const updateMainPhone = (event) => {

        console.log(event.target.value);
        updateCustomer(prevState => ({
            ...prevState,
            mainPhone: event.target.value
        }));
        console.log(customer.mainPhone);
    }

    // RIDER METHODS
    const handleRiderUpdate = (entryId, event, category) => {

        switch (category) {
            case 0:
                updateRiderName(entryId, event);
                break;
            case 1:
                updateRiderWeight(entryId, event);
                break;
        }
        toggleUpdateList(true);
    }

    const updateRiderName = (entryId, event) => {

        listOfRiders[entryId].name = event.target.value;
    }

    const updateRiderWeight = (entryId, event) => {

        listOfRiders[entryId].weight = event.target.value === '' ? 0 : parseInt(event.target.value);
    }

    /*const handleEdit = async (event) => {
        event.preventDefault();
    
        try {
          // 在Supabase中更新指定用户名的数据
          const { data, error } = await supabase
            .from('login')
            .update({ name: editName, email: editEmail})
            .eq('name', editingUser);
    
          if (error) {
            throw error;
          }
    
          console.log('Account updated successfully:', data);
    
          // 关闭编辑浮窗
          setShowEditPopup(false);
    
          // 刷新数据
          const { data: refreshedData, error: refreshError } = await supabase
            .from('login')
            .select('*');
    
          if (refreshError) {
            throw refreshError;
          }
    
          setLoginData(refreshedData);
        } catch (error) {
          console.error('Error editing account:', error.message);
          setErrorMessage(error.message);
        }
      };*/

    return (
            <form className="form-container" onSubmit={ handleSubmit }>
                <div className="form-main-content">
                    
                    {/* Add additional form sections */}
                    {/* Full Name */}
                    <div className="form-section">
                        <h2 className="form-title">Full Name</h2>
                        <div className="form-body">
                            <div className="form-body-wrapper_flex-column">
                                <div className="form-body-wrapper_flex-row">
                                    <div className="form-field flex1">
                                        <label htmlFor="name-title">Title</label>
                                        <input id="name-title" type="text"/>
                                    </div>
                                    <div className="form-field flex3">
                                        <label htmlFor="first-name">First Name</label>
                                        <input id="first-name" type="text"/>
                                    </div>
                                    <div className="form-field flex2">
                                        <label htmlFor="middle-name">Middle Name</label>
                                        <input id="middle-name" type="text"/>
                                    </div>
                                    <div className="form-field flex3">
                                        <label htmlFor="last-name">Last Name</label>
                                        <input id="last-name" type="text"/>
                                    </div>
                                    <div className="form-field flex1">
                                        <label htmlFor="suffix">Suffix</label>
                                        <input id="suffix" type="text"/>
                                    </div>
                                </div>
                                <div className="display-name-container">
                                    <label htmlFor="display-name" className="form-text">Customer Display Name (required) (i)</label>
                                    <span>
                                        <input className="form-checkbox" id="display-name-toggle" type="checkbox"/>
                                        <label className="form-checkbox-text" htmlFor="display-name-toggle">Override Display Name</label>
                                    </span>
                                    <div className="form-field">
                                        <input id="display-name" type="text"/>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contact */}
                    <div className="form-section">
                        <h2 className="form-title">Contact</h2>
                        <div className="form-body">
                            <div className="form-body-wrapper_flex-column">
                                <div className="form-body-wrapper_flex-row">
                                    <div className="form-field flex1">
                                        <label htmlFor="main-phone">Main Phone Number</label>
                                        <input id="name-phone" type="tel" value={customer.mainPhone} onChange={event => handleCustomerUpdate(event, customerCategory.mainPhone)}/>
                                    </div>
                                    <div className="form-field flex1">
                                        <label htmlFor="email">Email</label>
                                        <input id="email" type="email"/>
                                    </div>
                                </div>
                                <div className="form-body-wrapper_flex-row">
                                    <div className="form-field flex1">
                                        <label htmlFor="work-phone">Work Phone Number</label>
                                        <input id="work-phone" type="tel"/>
                                    </div>
                                    <div className="form-field flex1">
                                        <label htmlFor="cc-email">CC Email</label>
                                        <input id="cc-email" type="email"/>
                                    </div>
                                </div>
                                <div className="form-body-wrapper_flex-row">
                                    <div className="form-field flex1">
                                        <label htmlFor="mobile-phone">Mobile Phone Number</label>
                                        <input id="mobile-phone" type="tel"/>
                                    </div>
                                    <div className="form-field flex1">
                                        <label htmlFor="fax">Fax</label>
                                        <input id="fax" type="text"/>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Shipping Address */}
                    <div className="form-section">
                        <h2 className="form-title">Shipping Address</h2>
                        <div className="form-body">
                            <div className="form-body-wrapper_flex-column">
                                <div className="form-field">
                                    <label htmlFor="street-address">Street Address</label>
                                    <input id="street-address" type="text"/>
                                </div>
                                <div className="form-body-wrapper_flex-row">
                                    <div className="form-field flex5">
                                        <label htmlFor="street-address">City</label>
                                        <input id="street-address" type="text"/>
                                    </div>
                                    <div className="form-field flex0-1">
                                        <label htmlFor="street-address">State</label>
                                        <input id="street-address" type="text"/>
                                    </div>
                                    <div className="form-field flex1">
                                        <label htmlFor="street-address">Zip Code</label>
                                        <input id="street-address" type="text"/>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Billing Address */}
                    <div className="form-section">
                        <h2 className="form-title">Billing Address</h2>
                        <div className="form-body">
                            <div className="form-body-wrapper_flex-column">
                                <span>
                                    <input className="form-checkbox" id="same-as-toggle" type="checkbox"/>
                                    <label className="form-checkbox-text" htmlFor="same-as-toggle">Use same shipping address</label>
                                </span>
                                <div className="form-field">
                                    <label htmlFor="street-address">Street Address</label>
                                    <input id="street-address" type="text"/>
                                </div>
                                <div className="form-body-wrapper_flex-row">
                                    <div className="form-field flex5">
                                        <label htmlFor="street-address">City</label>
                                        <input id="street-address" type="text"/>
                                    </div>
                                    <div className="form-field flex0-1">
                                        <label htmlFor="street-address">State</label>
                                        <input id="street-address" type="text"/>
                                    </div>
                                    <div className="form-field flex1">
                                        <label htmlFor="street-address">Zip Code</label>
                                        <input id="street-address" type="text"/>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Riders */}
                    <div className="form-section">
                        <h2 className="form-title">Riders</h2>
                        <div className="form-body">
                            <div className='form-body-wrapper_flex-column'>
                            <span>
                                <input className="form-checkbox" id="customer-as-rider-toggle" type="checkbox" onClick={handleCustomerRiderToggle}/>
                                <label className="form-checkbox-text" htmlFor="customer-as-rider-toggle">Add customer as a rider too</label>
                            </span>
                            <table className="rider-table">
                                <thead>
                                    <tr>
                                        <th scope="col" width="5%">#</th>
                                        <th scope="col" width="34%">Name</th>
                                        <th scope="col">Weight (lbs)</th>
                                        <th scope="col" width="35%">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    { showRiderRows() }
                                </tbody>
                            </table>
                            </div>
                            <button className="submit-button" onClick={ addRider }>Add Rider</button>
                        </div>
                    </div>

                    {/* Notes */}
                    <div className="form-section">
                        <h2 className="form-title">Additional Details & Notes</h2>
                        <div className="form-body">
                            <div className="form-body-wrapper_flex-column">
                                <div className="form-body-additional-options">
                                    <div className="form-body-wrapper_flex-row">
                                        <div className="form-body-wrapper_flex-row form-dropdownMenu-wrapper">
                                        <span>
                                            <DropdownMenu itemList={["AM", "PM"]} htmlForRef="am-toggle" label="AM/PM"/>
                                        </span>
                                            <DropdownMenu itemList={["Public", "Private"]} htmlForRef="public-toggle" label="Public/Private"/>
                                        </div>
                                    </div>
                                    <div className="form-body-wrapper_flex-row form-body-external-ids">
                                        <div className="form-field">
                                            <label htmlFor="webOrderId">Web Order ID</label>
                                            <input id="webOrderId" type="text"/>
                                        </div>
                                        <div className="form-field">
                                            <label htmlFor="quickbooksId">QuickBooks ID</label>
                                            <input id="quickbooksId" type="text"/>
                                        </div> 
                                    </div>
                                    </div>
                                <div className="form-field">
                                    <textarea className="form-text-field" rows="8" value={text} onChange={event => setText(event.target.value)}/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            
                <div className="form-buttons">
                    <button className="submit-button">Create Customer</button>
                </div>
            </form>

    )
}

export default Form;