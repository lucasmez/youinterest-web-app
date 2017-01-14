import React from 'react';
import ReactDOM from 'react-dom';
import {Route, Router, IndexRoute, hashHistory} from 'react-router';

// Components
import Main from 'Main';
import Interest from 'Interest';
import InterestUsers from 'InterestUsers';
import InterestMeetups from 'InterestMeetups';
import InterestVideos from 'InterestVideos';
import InterestDiscussion from 'InterestDiscussion';
import InterestAbout from 'InterestAbout';
import MainPage from 'MainPage';

ReactDOM.render(
    <Router history={hashHistory}>
        <Route path="/" component={Main}>
            <Route path="interest/:interestName" component={Interest}>
                <IndexRoute component={InterestAbout} />
                <Route path="users" component={InterestUsers} />
                <Route path="meetups" component={InterestMeetups} />
                <Route path="videos" component={InterestVideos} />
                <Route path="discussion" component={InterestDiscussion} />
            </Route>
            <IndexRoute component={MainPage} />
        </Route>
    </Router>
    , document.querySelector('.react-container')
);
