import { PERMISSIONS } from './src/constants';

/**
 * @type {import('@commercetools-frontend/application-config').ConfigOptionsForCustomApplication}
 */
const config = {
  name: 'Report It',
  entryPointUriPath: '${env:ENTRY_POINT_URI_PATH}',
  cloudIdentifier: '${env:CLOUD_IDENTIFIER}',
  env: {
    development: {
      initialProjectKey: '${env:INITIAL_PROJECT_KEY}',
    },
    production: {
      applicationId: '${env:CUSTOM_APPLICATION_ID}',
      url: '${env:APPLICATION_URL}',
    },
  },
  oAuthScopes: {
    view: [
      'view_categories',
      'view_cart_discounts',
      'view_customer_groups',
      'view_customers',
      'view_discount_codes',
      'view_key_value_documents',
      'view_orders',
      'view_payments',
      'view_products',
      'view_shipping_methods',
      'view_shopping_lists',
      'view_standalone_prices',
      'view_states',
      'view_stores',
      'view_tax_categories',
      'view_types',
    ],
    manage: ['manage_key_value_documents'],
  },
  headers:{
    csp: {
      "connect-src": ["https://www.gstatic.com", "'unsafe-eval'"],
      "script-src": ["https://www.gstatic.com", "'unsafe-eval'"],
      "style-src": ["https://www.gstatic.com"],
      "img-src": ["https://www.gstatic.com",],
    }
  },
  icon: '${path:@commercetools-frontend/assets/application-icons/rocket.svg}',
  mainMenuLink: {
    defaultLabel: 'Report It',
    labelAllLocales: [],
    permissions: [PERMISSIONS.View],
  },
  submenuLinks: [
    {
      uriPath: '',
      defaultLabel: 'Report it',
      labelAllLocales: [],
      permissions: [PERMISSIONS.View],
    },
    {
      uriPath: 'configuration',
      defaultLabel: 'Configure Report It',
      labelAllLocales: [],
      permissions: [PERMISSIONS.View],
    },
  ],
};

export default config;
