import useGraphQL from '@/hooks/useGraphQL'

export function useFetchPools(): any {
  return useGraphQL(`
    pools(where: {workersCount_gt: 0}) {
      id
      ownerAddress
      onlineWorkersCount
      workersCount
      workers {
        refWorker {
          id
          createdAt
          updatedAt
          status
          successfulJobsCount
          processingJobsCount
          pendingJobsCount
          failedJobsCount
          panickyJobsCount
          erroredJobsCount
        }
      }
    }
`)
}

export function useFetchJobs(owner?: string): any {
  const clause = owner ? `, where: { beneficiaryAddress_eq: "${owner}" }` : ''
  return useGraphQL(`
    jobs(orderBy: createdAt_DESC, limit: 20${clause}) {
      proof
      processingAt
      poolId
      policyId
      input
      jobId
      id
      implSpecVersion
      expiresAt
      endedAt
      depositorAddress
      assigneeAddress
      assignedAt
      destroyerAddress
      beneficiaryAddress
      createdAt
      deletedAt
      output
      result
      status
      updatedAt
      uniqueTrackId
    }
`)
}

export function useFetchJob(id?: string | null): any {
  const { data } = useGraphQL(
    id
      ? `jobs(where: { id_eq: "${id}" }) 
      {
        proof
        processingAt
        poolId
        policyId
        input
        jobId
        id
        implSpecVersion
        expiresAt
        endedAt
        depositorAddress
        assigneeAddress
        assignedAt
        destroyerAddress
        beneficiaryAddress
        createdAt
        deletedAt
        output
        result
        status
        updatedAt
        uniqueTrackId
    }`
      : undefined
  ) as any
  return data?.jobs.length === 1 ? data.jobs[0] : undefined
}

export function useFetchGallery(): any {
  return useGraphQL(`
    jobs(where: {result_eq: Success, status_eq: Processed, output_isNull: false}, orderBy: uniqueTrackId_ASC, limit: 50) {
      id
      output
    }
`)
}
