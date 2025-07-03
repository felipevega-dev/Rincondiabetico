import type { LocalizationResource } from '@clerk/types'

export const clerkTranslations: Partial<LocalizationResource> = {
  signIn: {
    start: {
      title: "Iniciar sesión",
      subtitle: "para continuar en Dulces Pasmiño",
      actionText: "¿No tienes una cuenta?",
      actionLink: "Registrarse",
    },
  },
  signUp: {
    start: {
      title: "Crear una cuenta",
      subtitle: "para comenzar en Dulces Pasmiño",
      actionText: "¿Ya tienes una cuenta?",
      actionLink: "Iniciar sesión",
    },
  },
  userButton: {
    action__signOut: "Cerrar sesión",
    action__manageAccount: "Mi cuenta",
    action__signOutAll: "Cerrar todas las sesiones",
    action__addAccount: "Agregar cuenta",
  },
  userProfile: {
    title: "Mi perfil",
    subtitle: "Gestiona tu información personal",
    profilePage: {
      title: "Perfil",
      successMessage: "Perfil actualizado",
    },
    navbar: {
      account: "Cuenta",
      security: "Seguridad",
    },
  },
  formButtonPrimary: "Continuar",
  formButtonReset: "Cancelar",
  formFieldLabel__emailAddress: "Correo electrónico",
  formFieldLabel__password: "Contraseña",
  formFieldLabel__firstName: "Nombre",
  formFieldLabel__lastName: "Apellido",
  formFieldInputPlaceholder__emailAddress: "nombre@ejemplo.com",
  formFieldInputPlaceholder__password: "Tu contraseña",
  formFieldError__notMatchPattern: "El formato no es válido",
  formFieldError__required: "Este campo es requerido",
  formFieldError__emailAddressInvalid: "El correo electrónico no es válido",
  formFieldAction__forgotPassword: "¿Olvidaste tu contraseña?",
  footerActionLink__useAnotherMethod: "Usar otro método",
  dividerText: "o",
  socialButtonsBlockButton: "Continuar con {{provider}}",
  alert__signUp__verifyEmail__title: "Verifica tu correo",
  alert__signUp__verifyEmail__text: "Te hemos enviado un enlace de verificación",
  alert__error__title: "Algo salió mal",
  alert__error__text: "Ha ocurrido un error. Por favor, inténtalo de nuevo.",
} 