pipeline {
    agent any

    environment {
        // IDs de credenciales configuradas en Jenkins
        REGISTRY_CREDENTIALS = 'docker-registry-credentials'
        REGISTRY_URL        = 'docker.io'
        IMAGE_NAME          = 'codaress/bonoya-frontend'
        SSH_CREDENTIALS     = 'ssh-prod-server'
        DEPLOY_SERVER       = 'azureuser@135.119.49.103'
        COMPOSE_PATH        = '/opt/bonoya'  // Ruta en el servidor remoto donde está compose.yaml
    }

    options {
        skipDefaultCheckout(true)
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    def imageTag = "${REGISTRY_URL}/${IMAGE_NAME}:${BUILD_NUMBER}"
                    sh "docker build -t ${imageTag} ."
                    sh "docker tag ${imageTag} ${REGISTRY_URL}/${IMAGE_NAME}:latest"
                }
            }
        }

        stage('Push Docker Image') {
            steps {
                script {
                    withCredentials([usernamePassword(credentialsId: REGISTRY_CREDENTIALS, usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                        sh "echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin ${REGISTRY_URL}"
                        sh "docker push ${REGISTRY_URL}/${IMAGE_NAME}:${BUILD_NUMBER}"
                        sh "docker push ${REGISTRY_URL}/${IMAGE_NAME}:latest"
                        sh "docker logout ${REGISTRY_URL}"
                    }
                }
            }
        }

        stage('Deploy to Production') {
            steps {
                script {
                    def imageTag = "${REGISTRY_URL}/${IMAGE_NAME}:${BUILD_NUMBER}"
                    sshagent (credentials: [SSH_CREDENTIALS]) {
                        sh """
                        ssh -o StrictHostKeyChecking=no ${DEPLOY_SERVER} '
                            set -x
                            cd ${COMPOSE_PATH} && \
                            docker-compose -f docker-compose.prod.yml down -v --remove-orphans && \
                            docker-compose -f docker-compose.prod.yml pull && \
                            docker-compose -f docker-compose.prod.yml up -d && \
                            sleep 5 && \
                            docker-compose -f docker-compose.prod.yml ps && \
                            docker-compose -f docker-compose.prod.yml logs --tail=50 bonoya-frontend && \
                            docker image prune -f || echo "No logs disponibles"
                        '
                        """
                    }
                }
            }
        }
    }

    post {
        success {
            echo 'Despliegue completado con éxito.'
        }
        failure {
            echo 'La ejecución de la canalización falló.'
        }
    }
} 