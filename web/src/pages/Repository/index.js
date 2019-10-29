import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import api from '../../services/api';

import Container from '../../components/Container';
import { Loading, Owner, IssuesList, ButtonFilter } from './styles';

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
    page: 1,
  };

  async componentDidMount() {
    const { match } = this.props;
    const { filter, page } = this.state;
    const repoName = decodeURIComponent(match.params.repository);

    const [repository, issues] = await Promise.all([
      api.get(`/repos/${repoName}`),
      api.get(`/repos/${repoName}/issues?state=${filter}&page=${page}`, {
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
    const { page } = this.state;
    const repoName = decodeURIComponent(match.params.repository);

    this.setState({
      loading: true,
    });

    const issues = await api.get(
      `/repos/${repoName}/issues?state=${filter}&page=${page}`
    );

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
            <ButtonFilter
              type="button"
              value="all"
              onClick={this.handleFilter}
              filter={filter === 'all' ? 1 : 0}
            >
              Todos
            </ButtonFilter>
            <ButtonFilter
              type="button"
              value="open"
              onClick={this.handleFilter}
              filter={filter === 'open' ? 1 : 0}
            >
              Abertos
            </ButtonFilter>
            <ButtonFilter
              type="button"
              value="closed"
              onClick={this.handleFilter}
              filter={filter === 'closed' ? 1 : 0}
            >
              Fechados
            </ButtonFilter>
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
