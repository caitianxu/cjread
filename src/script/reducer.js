const defaultState = {
    member: null,
    member_id: null,
    member_token: null,
    org_id: 214,
    token_type: 'weixin',
    client_type: 'QY',
    client: {},
    loading: false,
    version: '1.0.0.3'
  };
  
  export default (state = defaultState, action) => {
    let newState = {...state};
    switch (action.type) {
      case 'set_client_info':
        newState.client = {...action.data};
        break;
      case 'set_member_info':
        newState.member = {...action.data};
        newState.member_id = newState.member.member_id;
        newState.member_token = newState.member.token;
        newState.org_id = newState.member.org_id;
        break;
      case 'update_member_info':
        newState.member = {...action.data};
        break;
      case 'set_public_loading':
        newState.loading = action.data;
        break;
      case 'clear_store_all':
        newState.member = null;
        newState.member_id = null;
        newState.member_token = null;
        break;
      default:
        break;
    }
    return newState;
  };
  