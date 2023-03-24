import React, { Fragment, useState, useEffect } from 'react';
import { Link, useMatch, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createProfile, getCurrentProfile } from '../../actions/profile';

/*
  NOTE: declare initialState outside of component
  so that it doesn't trigger a useEffect
  we can then safely use this to construct our profileData
 */
const initialState = {
  company: '',
  website: '',
  location: '',
  status: '',
  skills: '',
  githubusername: '',
  bio: '',
  twitter: '',
  facebook: '',
  linkedin: '',
  youtube: '',
  instagram: ''
};

const ProfileForm = ({
  profile: { profile, loading },
  createProfile,
  getCurrentProfile
}) => {
  const [formData, setFormData] = useState(initialState);

  const creatingProfile = useMatch('/create-profile');

  const [displaySocialInputs, toggleSocialInputs] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    // if there is no profile, attempt to fetch one
    if (!profile) getCurrentProfile();

    // if we finished loading and we do have a profile
    // then build our profileData
    if (!loading && profile) {
      const profileData = { ...initialState };
      for (const key in profile) {
        if (key in profileData) profileData[key] = profile[key];
      }
      for (const key in profile.social) {
        if (key in profileData) profileData[key] = profile.social[key];
      }
      // the skills may be an array from our API response
      if (Array.isArray(profileData.skills))
        profileData.skills = profileData.skills.join(', ');
      // set local state with the profileData
      setFormData(profileData);
    }
  }, [loading, getCurrentProfile, profile]);

  const {
    company,
    website,
    location,
    status,
    skills,
    githubusername,
    bio,
    twitter,
    facebook,
    linkedin,
    youtube,
    instagram
  } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = (e) => {
    const editing = profile ? true : false;
    e.preventDefault();
    createProfile(formData, editing).then(() => {
      if (!editing) navigate('/dashboard');
    });
  };

  return (
    <section className="container">
      <h1 className="large text-primary">
        {creatingProfile ? 'Crear tu perfil' : 'Editar tu perfil '}
      </h1>
      <p className="lead">
        <i className="fas fa-user" />
        {creatingProfile
          ? ` Vamos a obtener alguna información para hacer su perfil`
          : 'Agrega algunos cambios a tu perfil'}
      </p>
      <small>* = filas requeridas</small>
      <form className="form" onSubmit={onSubmit}>
        <div className="form-group">
          <select name="status" value={status} onChange={onChange}>
            <option>* Seleccione un estado profesional</option>
            <option value="Developer">Desarrollador</option>
            <option value="Junior Developer">Desarrollador Junior</option>
            <option value="Senior Developer">Desarrollador Señor</option>
            <option value="Student or Learning">Estudiante</option>
            <option value="Instructor">Instructor o maestro</option>
            <option value="Other">Otra</option>
          </select>
          <small className="form-text">
          Danos una idea de dónde estás en tu carrera
          </small>
        </div>
        <div className="form-group">
          <input
            type="text"
            placeholder="Companñia/empresa"
            name="company"
            value={company}
            onChange={onChange}
          />
          <small className="form-text">
           Podria ser tu propia empresa o un trabajo 
          </small>
        </div>
        <div className="form-group">
          <input
            type="text"
            placeholder="Sitio Web"
            name="website"
            value={website}
            onChange={onChange}
          />
          <small className="form-text">
            Podria ser tuyo o el de una compañia/empresa
          </small>
        </div>
        <div className="form-group">
          <input
            type="text"
            placeholder="Lugar"
            name="location"
            value={location}
            onChange={onChange}
          />
          <small className="form-text">
           Ciudad o Municipio (ej. SPS, Cortes)
          </small>
        </div>
        <div className="form-group">
          <input
            type="text"
            placeholder="* Habilidades"
            name="skills"
            value={skills}
            onChange={onChange}
          />
          <small className="form-text">
           Por favor use comas para separar  (ej. HTML,CSS,JavaScript,PHP)
          </small>
        </div>
        <div className="form-group">
          <input
            type="text"
            placeholder="Github Username"
            name="githubusername"
            value={githubusername}
            onChange={onChange}
          />
          <small className="form-text">
            Si desea sus últimos repositorios y un enlace de Github, incluya su
            nombre de usuario

          </small>
        </div>
        <div className="form-group">
          <textarea
            placeholder="Una bibliografia corta de ti "
            name="bio"
            value={bio}
            onChange={onChange}
          />
          <small className="form-text">Hablanos un poco acerca de ti </small>
        </div>

        <div className="my-2">
          <button
            onClick={() => toggleSocialInputs(!displaySocialInputs)}
            type="button"
            className="btn btn-light"
          >
            Agregar Otras Redes Sociales 
          </button>
          <span>Opcional</span>
        </div>

        {displaySocialInputs && (
          <Fragment>
            <div className="form-group social-input">
              <i className="fab fa-twitter fa-2x" />
              <input
                type="text"
                placeholder="Twitter URL"
                name="twitter"
                value={twitter}
                onChange={onChange}
              />
            </div>

            <div className="form-group social-input">
              <i className="fab fa-facebook fa-2x" />
              <input
                type="text"
                placeholder="Facebook URL"
                name="facebook"
                value={facebook}
                onChange={onChange}
              />
            </div>

            <div className="form-group social-input">
              <i className="fab fa-youtube fa-2x" />
              <input
                type="text"
                placeholder="YouTube URL"
                name="youtube"
                value={youtube}
                onChange={onChange}
              />
            </div>

            <div className="form-group social-input">
              <i className="fab fa-linkedin fa-2x" />
              <input
                type="text"
                placeholder="Linkedin URL"
                name="linkedin"
                value={linkedin}
                onChange={onChange}
              />
            </div>

            <div className="form-group social-input">
              <i className="fab fa-instagram fa-2x" />
              <input
                type="text"
                placeholder="Instagram URL"
                name="instagram"
                value={instagram}
                onChange={onChange}
              />
            </div>
          </Fragment>
        )}

        <input type="submit" className="btn btn-primary my-1" />
        <Link className="btn btn-light my-1" to="/dashboard">
         Regresar
        </Link>
      </form>
    </section>
  );
};

ProfileForm.propTypes = {
  createProfile: PropTypes.func.isRequired,
  getCurrentProfile: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
  profile: state.profile
});

export default connect(mapStateToProps, { createProfile, getCurrentProfile })(
  ProfileForm
);
