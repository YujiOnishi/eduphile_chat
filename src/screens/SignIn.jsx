import React from 'react';
import { Link, withRouter } from 'react-router-dom'
import { Formik } from 'formik';
import * as Yup from 'yup';
import {firebaseApp} from '../plugins/firebase';

class SignIn extends React.Component {
    _isMounted = false;

    handleOnSubmit (values){
        firebaseApp.auth().signInWithEmailAndPassword(values.email, values.password)
            .then(res => {
                this.props.history.push("/chat");
            })
            .catch(error => {
                alert(error);
            });
    }

    componentDidMount () {
        this._isMounted = true;
    }

    componentWillUnmount () {
        this._isMounted = false;
    }

    render() {
        return (
            <div className="siimple-content siimple-content--extra-small">
                <div className="siimple-h1 siimple--text-normal siimple--mb-1" align="center">
                    EduphileChat
                </div>
                <div className="siimple--px-5 siimple--py-5">
                    <div className="siimple-h3 siimple--text-normal siimple--mb-1" align="center">
                        -SignIn-
                    </div>
                    <Formik
                        initialValues={{ email: '', password: '' }}
                        onSubmit={(values) => this.handleOnSubmit(values)}
                        validationSchema={Yup.object().shape({
                            email: Yup.string().email().required(),
                            password: Yup.string().required(),
                        })}
                    >
                        {
                            ({ handleSubmit, handleChange, handleBlur, values, errors }) => (
                                <form onSubmit={handleSubmit}>
                                    <div className="siimple-field">
                                        <div className="siimple-field">
                                            <div className="siimple-field-label">email</div>
                                            <input className="siimple-input siimple-input--fluid" placeholder="you@email.com"
                                                type="email"
                                                name="email"
                                                id="email"
                                                autoComplete={"true"}
                                                value={values.email}
                                                onChange={handleChange}
                                                onBlur={handleBlur}/>
                                        </div>
                                        <div className="siimple-field-helper">
                                            {errors.email}
                                        </div>
                                        <div className="siimple-field-label">
                                            password
                                        </div>
                                        <input className="siimple-input siimple-input--fluid" placeholder="password"
                                            type="password"
                                            name="password"
                                            id="password"
                                            autoComplete={"true"}
                                            value={values.password}
                                            onChange={handleChange}
                                            onBlur={handleBlur}/>
                                        <div className="siimple-field-helper">
                                            {errors.password}
                                        </div>
                                        <div align="center">
                                            <button className="siimple-btn siimple-btn--primary siimple-btn--fluid siimple--text-bold"
                                                type="submit">
                                                SignIn
                                            </button>
                                        </div>
                                    </div>
                                    <div style={{ textAlign: 'center' }}>
                                    </div>
                                </form>
                            )
                        }
                    </Formik>
                </div>
                <div align="center">
                    <Link to="/signup" className="siimple-link">まだアカウントをお持ちでない方はこちら</Link>
                </div>
            </div>
        );
    }
}

export default withRouter(SignIn);