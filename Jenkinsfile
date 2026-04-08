pipeline {
    agent any

    tools {
        nodejs 'nodejs-20'
    }

    options {
        buildDiscarder(logRotator(numToKeepStr: '10'))
        timeout(time: 30, unit: 'MINUTES')
    }

    environment {
        IMAGE_NAME = "nirou42/node-tasks-api"
        IMAGE_TAG  = "latest"
        DROPLET_IP = "152.42.143.246"
        PATH = "${tool 'nodejs-20'}/bin:${PATH}"
    }

    stages {

        stage("install dependencies") {
            steps {
                script {
                    echo "=========== Installing dependencies =========="
                    sh '''#!/bin/bash -e
                        which node
                        which npm
                        node --version
                        npm --version
                        npm ci --omit=dev
                    '''
                }
            }
        }

        stage("run tests") {
            steps {
                script {
                    echo "========== Running tests =========="
                    sh '''#!/bin/bash -e
                        set -x
                        npm test
                    '''
                }
            }
        }

        stage("build & push image") {
            steps {
                script {
                    echo "========== Building Docker image =========="
                    withCredentials([usernamePassword(
                        credentialsId: 'docker-hub-repo',
                        usernameVariable: 'USER',
                        passwordVariable: 'PASS'
                    )]) {
                        sh "docker build -t ${IMAGE_NAME}:${IMAGE_TAG} ."
                        sh "echo $PASS | docker login -u $USER --password-stdin"
                        sh "docker push ${IMAGE_NAME}:${IMAGE_TAG}"
                    }
                }
            }
        }

        stage("deploy to digitalocean") {
            steps {
                script {
                    echo "========== Deploying to DigitalOcean =========="
                    withCredentials([
                        sshUserPrivateKey(
                            credentialsId: 'digitalocean-ssh',
                            keyFileVariable: 'SSH_KEY'
                        ),
                        string(
                            credentialsId: 'app-version',
                            variable: 'APP_VERSION'
                        )
                    ]) {
                        sh """
                            ssh -o StrictHostKeyChecking=no \
                                -i ${SSH_KEY} \
                                kinpashi@${DROPLET_IP} '
                                    docker stop node-tasks-api || true
                                    docker rm node-tasks-api || true
                                    docker pull ${IMAGE_NAME}:${IMAGE_TAG}
                                    docker run -d \
                                        -p 3000:3000 \
                                        --name node-tasks-api \
                                        --env-file /home/kinpashi/app.env \
                                        ${IMAGE_NAME}:${IMAGE_TAG}
                                '
                        """
                    }
                }
            }
        }
    }

    post {
        success {
            echo "✅ Pipeline succeeded! App live at http://${DROPLET_IP}:3000"
        }
        failure {
            echo "❌ Pipeline failed! Check logs above."
        }
    }
}
