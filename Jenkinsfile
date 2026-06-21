pipeline {
  agent { label 'docker' }

  options {
    timestamps()
    disableConcurrentBuilds()
  }

  environment {
    REGISTRY = 'gitea.albireo.me/crux'
    IMAGE    = 'testory'
  }

  stages {
    stage('Build & Push (multi-arch)') {
      steps {
        script {
          docker.withRegistry("https://${env.REGISTRY}", 'gitea_albireo') {
            sh '''
              set -e
              # Reuse a multi-arch builder if present, else create one.
              docker buildx use multiarch 2>/dev/null || docker buildx create --name multiarch --use
              docker buildx inspect --bootstrap

              docker buildx build \
                --platform linux/amd64,linux/arm64 \
                --tag ${REGISTRY}/${IMAGE}:latest \
                --tag ${REGISTRY}/${IMAGE}:${BUILD_NUMBER} \
                --push \
                .
            '''
          }
        }
      }
    }
  }

  post {
    success { echo "Pushed ${REGISTRY}/${IMAGE}:latest (amd64+arm64). Deploy manually per node (see deploy/README.md)." }
  }
}
