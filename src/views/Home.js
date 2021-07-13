import React, {useState} from 'react';
// import sections
import Hero from '../components/sections/Hero';
import GenericSection from "../components/sections/GenericSection";
// import Image from "../components/elements/Image";
import * as yup from "yup";
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import firebase from "firebase";
import {toast, ToastContainer} from "react-toastify";
import Button from "../components/elements/Button";
import FeaturesTiles from "../components/sections/FeaturesTiles";

const Home = () => {

  return (
    <>
      <Hero className="illustration-section-01" />
      <GenericSection className="illustration-section-02" children={
        <div className='hero-figure reveal-from-bottom illustration-element-01' data-reveal-value='20px' data-reveal-delay='800'>
          <p className='m-0 mb-32 reveal-from-bottom' data-reveal-delay='400'>
            Join the closed beta now for early access to the conversations of the future.
          </p>

          <CustomForm/>

          {/*<ImageHorizontalList/>*/}

          <FeaturesTiles/>

          {/*<Image*/}
          {/*  className='has-shadow'*/}
          {/*  src={require('./../assets/images/demo.gif')}*/}
          {/*  alt='Hero'*/}
          {/*  width={896}*/}
          {/*  height={504} />*/}
        </div>
      }/>

    </>
  );
}


function CustomForm() {
  const [privacyState, setPrivacy] = useState(false);
  const [emailState, setEmail] = useState('');

  const schema = yup.object().shape({
    email: yup.string().email().required(),
    privacy: yup.bool().required().oneOf([true], 'Privacy policy must be agreed'),
  });
  const { register, handleSubmit, formState:{ errors } } = useForm({
    resolver: yupResolver(schema)
  });

  const subscribe = () => {
    // firebase.functions().useEmulator('0.0.0.0', 5001);
    const subscribe = firebase.functions().httpsCallable('subscribe');
    subscribe({ email: emailState })
      .then((result) => {
        if (result.data.statusCode !== 200) {
          toast.error(`🥵 ${result.data.errorMessage ?? 'It is too late, AI has taken over the world'}!`, {
            position: 'top-right',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        } else {
          toast.success('🦄 Congrats! You made a great decision', {
            position: 'top-right',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        }
      })
  }

  const onSubmit = _ => subscribe();

  return (
    <form className={`hero-beta-form`} onSubmit={handleSubmit(onSubmit)}>
      <input placeholder='Enter your email' className='hero-beta-email mx-auto reveal-from-bottom' {...register('email')}
             onChange={(e) => setEmail(e.target.value)} value={emailState}/>
      <p>{errors.email?.message}</p>

      <Button className='reveal-from-bottom' variant='outlined' color='primary'>Join the closed beta now</Button>
      <div className='hero-beta-privacy-group reveal-from-bottom'>
        <input {...register('privacy')} type='checkbox' checked={privacyState} onChange={(e) => setPrivacy(e.target.checked)} id='privacy' name='privacy' />
        <label htmlFor='privacy'>I agree to the <a target='_blank' rel='noopener noreferrer' href='https://help.langa.me/privacy'>privacy
          policy</a> and allow Langame to send me updates. You can unsubscribe anytime.</label>
      </div>
      <p>{errors.privacy?.message}</p>
      <ToastContainer />
    </form>
  );
}

export default Home;
