import * as yup from 'yup';

export const validationRules = [
    yup.object({
        firstName: yup.string().required('Full Name is required'),
        lastName: yup.string().required('Last Name is required'),
        address1: yup.string().required('Address1 is required'),
        address2: yup.string().optional(),
        city: yup.string().required('City is required'),
        state: yup.string().required('State is required'),
        zip: yup.string().required('Zip is required'),
        country: yup.string().required('Country is required')
    }),
    yup.object(),
    yup.object({
        cardName: yup.string().required(),
        cardNumber: yup.string().required(),
        expDate: yup.string().required(),
        cvv: yup.string().required()
    })
]