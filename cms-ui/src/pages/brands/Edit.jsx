import { InputField, Loading, SelectField, SubmitBtn } from "@/components"
import http from "@/http"
import { handleValidationError } from "@/lib"
import { setUser } from "@/store"
import { useFormik } from "formik"
import { useEffect, useState } from "react"
import { Col, Container, Form, Row } from "react-bootstrap"
import { useNavigate, useParams } from "react-router-dom"
import * as Yup from 'yup'

export const Edit = () => {
    const [brand, setBrand] = useState([])
    const [loading, setLoading] = useState(false)
    
    const params = useParams()
    const navigate = useNavigate()

    

    
    const formik = useFormik({
        initialValues: {
            name: '',
            status: true,
        },
        validationSchema: Yup.object({
            name: Yup.string().required(),
        }),
        onSubmit: (data, { setSubmitting }) => {
            http.patch(`/cms/brand/${params.id}`, data)
                .then(() => navigate('/brands'))
                .then(({ data }) => dispatch(setUser(data)))
                .catch(({ response }) => handleValidationError(formik, response.data))
                .finally(() => setSubmitting(false))
        }
    })

    useEffect(() => {
        http.get(`/cms/brand/${params.id}`)
            .then(({data}) => setBrand(data))
            .catch(() => {})
            .finally(() => setLoading(false))
        setLoading(true)
    }, [])
    
    useEffect(() => {
        formik.setValues({
         name: brand?.name,
         status: brand?.status,
        })
     }, [brand])

    return <Container className="bg-white py-3 my-3 rounded-2 shadow-sm">
        {loading ? <Loading /> : <>
            <Row>
                <Col>
                    <h1>Edit Brand</h1>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Form onSubmit={formik.handleSubmit}>
                        <InputField formik={formik} name="name" label="Name" />
                        <SelectField 
                            formik={formik} 
                            name="status" 
                            label="Status" 
                            options={{ 'Active': true, 'Inactive': false}} 
                            onChange={({ target }) => formik.setFieldValue('status', target.value == 'true') }
                        />

                        <SubmitBtn loading={formik.isSubmitting} ></SubmitBtn>
                    </Form>
                </Col>
            </Row>

        </>}
        
    </Container>
}