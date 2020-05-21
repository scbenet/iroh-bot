const config = require('./config')
const twit = require('twit')
const T = new twit(config)

function tweet(){

    let params = {
        q: '@UnclelyAdvice',
        result_type: 'recent',
        count: 10
    }

    T.get('search/tweets', params, (err, data, response)=>{
        let tweets = data.statuses
        let reply = 'fuck'

        if(!err){
            for(let dat of tweets){
                let tweetId = dat.id_str
                T.post('statuses/update', {in_reply_to_status_id: tweetId, status: reply}, function(err, data, response){
                    console.log(reply)
                })
            }
        }
    })
}