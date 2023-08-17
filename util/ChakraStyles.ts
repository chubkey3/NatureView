import { ChakraStylesConfig } from "chakra-react-select";

const chakraStyles: ChakraStylesConfig = {
    menu: (provided) => ({
        ...provided,
        maxH: '120px',
        overflowY: 'auto',                 
                         
    }),
    clearIndicator: (provided) => ({
        ...provided,
        display: 'none'
                
    }),
    placeholder: (provided) => ({
        ...provided,
        color: 'rgba(39, 103, 73, 0.7)',
    }),
    container: (provided) => ({
        ...provided,
        borderColor: 'rgba(30, 130, 0, 0.5)',            
    }),
    indicatorsContainer: (provided) => ({
        ...provided,
        maxWidth: '30px',     
        backgroundColor: 'green.300'                   
    }),
    downChevron: (provided) => ({
        ...provided,
        color: 'green.800'
    }),
    multiValueRemove: (provided) => ({
        ...provided,                       
        fontSize: 'md',
        width: '10px',
        height: '10px',            
    }),
    multiValueLabel: (provided) => ({
        ...provided,
        fontSize: 'xs',            
    })        
}

export default chakraStyles