import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import api from '../../services/api';

import Container from '../../components/Container';
import { Loading, Owner, IssuesList } from './styles';

export default class Repository extends Component {
  static propTypes = {
    match: PropTypes.shape({
      params: PropTypes.shape({
        repository: PropTypes.string,
      }),
    }).isRequired,
  };

  state = {
    repository: {},
    issues: [],
    loading: true,
    filter: 'all',
  };

  async componentDidMount() {
    const { match } = this.props;

    const repoName = decodeURIComponent(match.params.repository);

    const [repository, issues] = await Promise.all([
      api.get(`/repos/${repoName}`),
      api.get(`/repos/${repoName}/issues?state=all`, {
        params: {
          state: 'open',
          per_page: 5,
        },
      }),
    ]);

    this.setState({
      repository: repository.data,
      issues: issues.data,
      loading: false,
    });
  }

  handleFilter = async e => {
    e.preventDefault();
    const filter = e.target.value;
    const { match } = this.props;
    const repoName = decodeURIComponent(match.params.repository);

    this.setState({
      loading: true,
    });

    const issues = await api.get(`/repos/${repoName}/issues?state=${filter}`);

    this.setState({
      issues: issues.data,
      loading: false,
      filter,
    });
  };

  render() {
    const { repository, issues, loading, filter } = this.state;

    if (loading) {
      return <Loading>Carregando...</Loading>;
    }
    return (
      <Container>
        <Owner filter={filter}>
          <Link to="/">Voltar aos repositórios</Link>
          <img src={repository.owner.avatar_url} alt={repository.owner.login} />
          <h1>{repository.name}</h1>
          <p>{repository.description}</p>
          <div>
            <button
              type="button"
              value="all"
              onClick={this.handleFilter}
              autoFocus={filter === 'all' ? 1 : 0}
            >
              Todos
            </button>
            <button
              type="button"
              value="open"
              onClick={this.handleFilter}
              autoFocus={filter === 'open' ? 1 : 0}
            >
              Abertos
            </button>
            <button
              type="button"
              value="closed"
              onClick={this.handleFilter}
              autoFocus={filter === 'closed' ? 1 : 0}
            >
              Fechados
            </button>
          </div>
        </Owner>
        <IssuesList>
          {issues.map(issue => (
            <li key={String(issue.id)}>
              <img src={issue.user.avatar_url} alt={issue.user.login} />
              <div>
                <strong>
                  <a href={issue.html_url}>{issue.title}</a>
                  {issue.labels.map(label => (
                    <span key={String(label.id)}>{label.name}</span>
                  ))}
                  <p>{issue.user.login}</p>
                </strong>
              </div>
            </li>
          ))}
        </IssuesList>
      </Container>
    );
  }
}
