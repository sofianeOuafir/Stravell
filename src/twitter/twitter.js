import Twitter from 'twitter';

const client = new Twitter({
  consumer_key: 'Qkq0LILBdbV8U4cpQdGri8LMR',
  consumer_secret: '7YBuif7cAJxWXiISUbXMRpboM2TX28ZrSR9Vj27oj7WdlNbsJq',
  access_token_key: '819852518960275456-S4CZJDhOESQc4R7ucsqEFIslJRUmGQX',
  access_token_secret: 'v1MjgJg83nVOIVqyJlu8XmHe5kfLDLZkDWH3CCtVtDk8J'
});


export const createTweet = () => {
  return client.post('statuses/update', {status: 'I Love Twitter'});
}