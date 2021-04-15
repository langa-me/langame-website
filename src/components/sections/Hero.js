import React, {useState} from 'react';
import classNames from 'classnames';
import { SectionProps } from '../../utils/SectionProps';
import Image from '../elements/Image';
import appStore from './../../assets/images/app-store.svg';
import googlePlay from './../../assets/images/google-play.svg';
import ReactTooltip from 'react-tooltip';
import Button from '../elements/Button';
import firebase from 'firebase';
import {useForm} from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

firebase.initializeApp({
  projectId: 'langame-86ac4',
  apiKey: 'AIzaSyDxLmqscMfKF6FUd_rXcsJxH--w0PQhVWw',
  authDomain: 'langame-86ac4.firebaseapp.com',
});

const propTypes = {
  ...SectionProps.types,
}

const defaultProps = {
  ...SectionProps.defaults,
}

const Hero = ({
  className,
  topOuterDivider,
  bottomOuterDivider,
  topDivider,
  bottomDivider,
  hasBgColor,
  invertColor,
  ...props
}) => {


  const outerClasses = classNames(
    'hero section center-content',
    topOuterDivider && 'has-top-divider',
    bottomOuterDivider && 'has-bottom-divider',
    hasBgColor && 'has-bg-color',
    invertColor && 'invert-color',
    className
  );

  const innerClasses = classNames(
    'hero-inner section-inner',
    topDivider && 'has-top-divider',
    bottomDivider && 'has-bottom-divider'
  );

  return (
    <section
      {...props}
      className={outerClasses}
    >
      <div className='container-sm'>
        <div className={innerClasses}>
          <div className='hero-content'>
            <h1 className='mt-0 mb-16 reveal-from-bottom' data-reveal-delay='200'>
              <span className='text-color-primary'>Langame</span>
            </h1>
            <div className='container-xs'>
              <p className='m-0 mb-32 reveal-from-bottom' data-reveal-delay='400'>
                AI-Augmented human conversations.
              </p>
              <p className='m-0 mb-32 reveal-from-bottom' data-reveal-delay='400'>
                The Internet and its hyper-connectivity have not solved human conversations.
              </p>
            </div>
            <CustomForm/>
          </div>
          <div className='hero-figure reveal-from-bottom illustration-element-01' data-reveal-value='20px' data-reveal-delay='800'>
            <Image
              className='has-shadow'
              src={require('./../../assets/images/demo.gif')}
              alt='Hero'
              width={896}
              height={504} />
          </div>
          <ReactTooltip id='main'/>

          <div className='distribution'>
            <div className='app-store'>
              <p data-for='main' data-tip='Coming soon on iOS.' data-iscapture='true'>
                <img src={appStore} alt='App Store'/>
              </p>
            </div>

            <div className='google-play'>
              <p data-for='main' data-tip='Coming soon on Android.' data-iscapture='true'>
                <img src={googlePlay} alt='Google Play'/>
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
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
      <input placeholder='your@email.com' className='hero-beta-email mx-auto reveal-from-bottom' {...register('email')}
             onChange={(e) => setEmail(e.target.value)} value={emailState}/>
      <p>{errors.email?.message}</p>

      <Button className='reveal-from-bottom' variant='outlined' color='primary'>Register for beta</Button>
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

Hero.propTypes = propTypes;
Hero.defaultProps = defaultProps;

export default Hero;
