import React, { useState } from 'react';

const DynamicForm = ({ schema, onSubmit, submitText = 'Submit' }) => {
    const [formData, setFormData] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form className="form-builder" onSubmit={handleSubmit}>
            {schema.map((field) => (
                <div key={field.name} className="form-group">
                    <label htmlFor={field.name}>{field.label}</label>
                    {field.type === 'select' ? (
                        <select 
                            id={field.name}
                            name={field.name} 
                            onChange={handleChange} 
                            required={field.required}
                        >
                            <option value="">Select...</option>
                            {field.options.map(opt => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                        </select>
                    ) : (
                        <input 
                            id={field.name}
                            type={field.type || 'text'} 
                            name={field.name} 
                            placeholder={field.placeholder} 
                            onChange={handleChange} 
                            required={field.required}
                        />
                    )}
                </div>
            ))}
            <button type="submit" className="btn btn-primary">{submitText}</button>
        </form>
    );
};

export default DynamicForm;
