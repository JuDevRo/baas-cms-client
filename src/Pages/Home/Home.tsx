import Layout from '../../components/Layout/Layout'
import { useAuthGuard } from '../../hooks/useAuthGuard'
import { useSelector } from 'react-redux'
import './Home.css'
import type { UserPayload } from '../../types/user'
import { useGetProjects } from '../../hooks/useProjects'
import { useNavigate } from 'react-router-dom'

const Home = () => {
  useAuthGuard()
  const navigate = useNavigate()

  const userId = useSelector((store: { user: { user: UserPayload } }) => store.user.user._id)

  const { projects, loading, error } = useGetProjects(userId)

  const goToProject = (projectId: string) => {
    navigate(`/project/${projectId}`)
  }

  return (
    <Layout>
      <div>
        <h2>Proyectos:</h2>
      </div>
      <div>
        {
          projects.length === 0 ? (
            <p>No projects found</p>
          ) : (
            projects.map((project: any) => (
              <div key={project._id} onClick={() => goToProject(project._id)} className="home-project-card">
                <h3>{project.name}</h3>
                <p>{project.description}</p>
              </div>
            ))
          ) 
        }
      </div>
    </Layout>
  ) 
}

export default Home