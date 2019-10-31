import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import parse from 'parse-link-header';
import PropTypes from 'prop-types';
import api from '../../services/api';

import Container from '../../components/Container';
import { Loading, Owner, IssuesList, ButtonFilter, ButtonPage } from './styles';

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
    prev: 0,
    next: 2,
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

    this.setPages(issues);

    this.setState({
      repository: repository.data,
      issues: issues.data,
      loading: false,
    });
  }

  setPages = data => {
    const { page } = this.state;

    if (!data.headers.link) {
      this.setState({
        next: 0,
      });
    } else {
      const parsed = parse(data.headers.link);
      this.setState({
        prev: page - 1,
        next: parsed.next ? parseInt(parsed.next.page) : 0,
      });
    }
  };

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

  handleAddPage = async e => {
    e.preventDefault();
    const { match } = this.props;
    const { next, filter } = this.state;
    const repoName = decodeURIComponent(match.params.repository);

    if (next === 0) return;

    this.setState({
      loading: true,
      page: next,
    });

    const issues = await api.get(
      `/repos/${repoName}/issues?state=${filter}&page=${next}`
    );

    this.setPages(issues);

    this.setState({
      issues: issues.data,
      loading: false,
    });
  };

  handleSubPage = async e => {
    e.preventDefault();

    const { match } = this.props;
    const { prev, filter } = this.state;
    const repoName = decodeURIComponent(match.params.repository);

    if (prev === 0) return;

    this.setState({
      loading: true,
      page: prev,
    });

    const issues = await api.get(
      `/repos/${repoName}/issues?state=${filter}&page=${prev}`
    );

    this.setPages(issues);

    this.setState({
      issues: issues.data,
      loading: false,
    });
  };

  render() {
    const {
      repository,
      issues,
      loading,
      filter,
      prev,
      next,
      page,
    } = this.state;

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
          <div id="pages">
            <ButtonPage lock={prev === 0 ? 1 : 0} onClick={this.handleSubPage}>
              Anterior
            </ButtonPage>
            <span>Página: {page}</span>
            <ButtonPage lock={next === 0 ? 1 : 0} onClick={this.handleAddPage}>
              Próxima
            </ButtonPage>
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
