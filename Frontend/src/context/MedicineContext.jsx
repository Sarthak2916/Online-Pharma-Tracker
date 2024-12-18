import React, { createContext, useContext, useState } from 'react';

const MedicineContext = createContext();

export const MedicineProvider = ({ children }) => {
    const [selectedMedicines, setSelectedMedicines] = useState({});
    const [medicineDetails, setMedicineDetails] = useState({});

    const updateMedicineSelection = (medicineId, quantity, details) => {
        if (quantity === 0) {
            const newSelection = { ...selectedMedicines };
            delete newSelection[medicineId];
            setSelectedMedicines(newSelection);
        } else {
            setSelectedMedicines(prev => ({
                ...prev,
                [medicineId]: quantity
            }));
        }

        if (details) {
            setMedicineDetails(prev => ({
                ...prev,
                [medicineId]: details
            }));
        }
    };

    const resetMedicineSelection = () => {
        setSelectedMedicines({});
        setMedicineDetails({});
    };

    return (
        <MedicineContext.Provider value={{
            selectedMedicines,
            medicineDetails,
            updateMedicineSelection,
            resetMedicineSelection
        }}>
            {children}
        </MedicineContext.Provider>
    );
};

export const useMedicineContext = () => {
    const context = useContext(MedicineContext);
    if (!context) {
        throw new Error('useMedicineContext must be used within a MedicineProvider');
    }
    return context;
};
