<template>
  <BaseModal
    title="Detalhes da Tarefa"
    :isLoading="false"
    @close="closeModal"
    :showFooter="false"
    :hasCustomHeader="true"
  >
    <template #custom-header>
      <div
        class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between p-3 sm:px-6 sm:py-4"
      >
        <div class="flex items-center gap-3">
          <div v-if="loadedTicket">
            <h2 class="text-lg sm:text-lg font-semibold text-gray-900 dark:text-gray-100">
              Detalhes da Tarefa
            </h2>
            <p class="text-gray-600 font-medium dark:text-gray-400">
              {{ loadedTicket.customId }}
            </p>
          </div>
          <div v-else class="flex flex-col gap-2">
            <div class="h-6 w-48 bg-gray-200 dark:bg-gray-700 rounded skeleton-shimmer"></div>
            <div class="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded skeleton-shimmer"></div>
          </div>
        </div>

        <!-- Action Buttons in Header -->
        <div class="flex items-center gap-2 ml-4" v-if="loadedTicket">
          <div
            class="flex items-center gap-2"
            v-if="
              isTargetUser || (isReviewer && ticketStatus === DefaultTicketStatus.UnderVerification)
            "
          >
            <button
              v-if="isTargetUser && ticketStatus === DefaultTicketStatus.Pending && isSelfAssigned"
              class="inline-flex items-center gap-1.5 px-3 py-2 bg-green-600 hover:bg-green-700 text-sm text-white font-medium rounded-md transition-colors"
              @click="startTicket(loadedTicket?.customId)"
            >
              <font-awesome-icon icon="play" class="text-xs" />
              Iniciar
            </button>

            <button
              v-else-if="isTargetUser && ticketStatus === DefaultTicketStatus.Pending"
              class="inline-flex items-center gap-1.5 px-3 py-2 bg-green-600 hover:bg-green-700 text-sm text-white font-medium rounded-md transition-colors"
              @click="acceptTicket(loadedTicket?.customId)"
            >
              <font-awesome-icon icon="check" class="text-xs" />
              Aceitar
            </button>

            <button
              v-if="
                isTargetUser && ticketStatus === DefaultTicketStatus.InProgress && !isLastTargetUser
              "
              class="inline-flex items-center gap-1.5 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-sm text-white font-medium rounded-md transition-colors"
              @click="sendToNextDepartment(loadedTicket.customId)"
            >
              <font-awesome-icon icon="arrow-right" class="text-xs" />
              Enviar Para Próximo Setor
            </button>

            <button
              v-if="
                isTargetUser && ticketStatus === DefaultTicketStatus.InProgress && isLastTargetUser
              "
              class="inline-flex items-center gap-1.5 px-3 py-2 bg-primary hover:bg-blue-700 text-sm text-white font-medium rounded-md transition-colors"
              @click="sendForReview(loadedTicket.customId)"
            >
              <font-awesome-icon icon="arrow-right" class="text-xs" />
              Enviar Para Verificação
            </button>

            <button
              v-if="isTargetUser && ticketStatus === DefaultTicketStatus.AwaitingVerification"
              class="inline-flex items-center gap-1.5 px-3 py-2 bg-yellow-600 hover:bg-yellow-700 text-sm text-white font-medium rounded-md transition-colors"
              @click="cancelVerificationRequest(loadedTicket.customId)"
            >
              <font-awesome-icon icon="undo" class="text-xs" />
              Cancelar Envio
            </button>

            <button
              v-if="isTargetUser && ticketStatus === DefaultTicketStatus.Returned"
              class="inline-flex items-center gap-1.5 px-3 py-2 bg-orange-600 hover:bg-orange-700 text-sm text-white font-medium rounded-md transition-colors"
              @click="correctTicket(loadedTicket.customId)"
            >
              <font-awesome-icon icon="wrench" class="text-xs" />
              Corrigir
            </button>

            <button
              v-if="isReviewer && ticketStatus === DefaultTicketStatus.UnderVerification"
              class="inline-flex items-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-sm text-white font-medium rounded-md transition-colors"
              @click="approveTicket(loadedTicket.customId)"
            >
              <font-awesome-icon icon="check-double" class="text-xs" />
              Aprovar
            </button>

            <button
              v-if="isReviewer && ticketStatus === DefaultTicketStatus.UnderVerification"
              class="inline-flex items-center gap-1.5 px-3 py-2 bg-purple-600 hover:bg-purple-700 text-sm text-white font-medium rounded-md transition-colors"
              @click="requestCorrection(loadedTicket.customId)"
            >
              <font-awesome-icon icon="undo" class="text-xs" />
              Correção
            </button>

            <button
              v-if="isReviewer && ticketStatus === DefaultTicketStatus.UnderVerification"
              class="inline-flex items-center gap-1.5 px-3 py-2 bg-red-600 hover:bg-red-700 text-sm text-white font-medium rounded-md transition-colors"
              @click="rejectTicket(loadedTicket.customId)"
            >
              <font-awesome-icon icon="times" class="text-xs" />
              Reprovar
            </button>
          </div>

          <button
            v-if="
              isRequester &&
              ticketStatus !== DefaultTicketStatus.Completed &&
              ticketStatus !== DefaultTicketStatus.Rejected &&
              ticketStatus !== DefaultTicketStatus.Canceled
            "
            class="inline-flex items-center gap-1.5 px-3 py-2 bg-red-600 hover:bg-red-700 text-sm text-white font-medium rounded-md transition-colors"
            @click="cancelTicket(loadedTicket.customId)"
          >
            <font-awesome-icon icon="ban" class="text-xs" />
            Cancelar Tarefa
          </button>

          <button
            class="bg-transparent border-none text-xl text-gray-400 ml-8 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 cursor-pointer p-1.5 rounded-full flex items-center justify-center transition-colors ml-2"
            @click="closeModal"
          >
            <font-awesome-icon icon="times" />
          </button>
        </div>
      </div>
    </template>

    <div
      class="relative w-[85vw] max-w-[1280px] mx-auto p-3 sm:p-0 h-[calc(100vh-200px)] max-h-[650px] flex flex-col"
    >
      <!-- Skeleton Loading State -->
      <div
        v-if="isLoadingTicket && !hasLoadedTicketOnce"
        class="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-0"
      >
        <!-- Left Sidebar Skeleton -->
        <div class="lg:col-span-1 overflow-y-auto pr-4 space-y-4">
          <div
            class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 sm:p-5 shadow-sm"
          >
            <div class="h-5 w-32 bg-gray-200 dark:bg-gray-700 rounded mb-4 skeleton-shimmer"></div>
            <div class="space-y-4">
              <div v-for="n in 8" :key="n" class="flex items-start gap-3">
                <div class="w-[40%]">
                  <div class="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded skeleton-shimmer"></div>
                </div>
                <div class="flex-1">
                  <div class="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded skeleton-shimmer"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Content Skeleton -->
        <div class="lg:col-span-2 overflow-y-auto pl-2">
          <div class="bg-white dark:bg-gray-800 pr-4 rounded-lg shadow-sm">
            <!-- Title Skeleton -->
            <div class="p-4">
              <div
                class="h-8 w-3/4 bg-gray-200 dark:bg-gray-700 rounded mb-4 skeleton-shimmer"
              ></div>
              <div class="h-10 w-24 bg-gray-200 dark:bg-gray-700 rounded skeleton-shimmer"></div>
            </div>

            <!-- Description Skeleton -->
            <div class="my-2 px-4 sm:px-6">
              <div
                class="h-5 w-24 bg-gray-200 dark:bg-gray-700 rounded mb-3 skeleton-shimmer"
              ></div>
              <div class="space-y-2">
                <div class="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded skeleton-shimmer"></div>
                <div class="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded skeleton-shimmer"></div>
                <div class="h-4 w-5/6 bg-gray-200 dark:bg-gray-700 rounded skeleton-shimmer"></div>
              </div>
            </div>

            <!-- Attachments Skeleton -->
            <div class="p-4 sm:p-6 border-t border-gray-200 dark:border-gray-700">
              <div
                class="h-5 w-32 bg-gray-200 dark:bg-gray-700 rounded mb-4 skeleton-shimmer"
              ></div>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div
                  v-for="n in 2"
                  :key="n"
                  class="h-20 bg-gray-200 dark:bg-gray-700 rounded-lg skeleton-shimmer"
                ></div>
              </div>
            </div>

            <!-- Activities Skeleton -->
            <div class="p-4 sm:p-6 border-t border-gray-200">
              <div
                class="h-5 w-24 bg-gray-200 dark:bg-gray-700 rounded mb-6 skeleton-shimmer"
              ></div>
              <div class="space-y-4">
                <div v-for="n in 3" :key="n" class="flex gap-4">
                  <div
                    class="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full skeleton-shimmer"
                  ></div>
                  <div class="flex-1 space-y-2">
                    <div
                      class="h-4 w-3/4 bg-gray-200 dark:bg-gray-700 rounded skeleton-shimmer"
                    ></div>
                    <div
                      class="h-4 w-1/2 bg-gray-200 dark:bg-gray-700 rounded skeleton-shimmer"
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Actual Content -->
      <div v-else-if="loadedTicket" class="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-0">
        <!-- Left Sidebar -->
        <div class="lg:col-span-1 overflow-y-auto pr-4 space-y-4">
          <div
            class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 sm:p-5 shadow-sm"
          >
            <h3
              class="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2"
            >
              <font-awesome-icon icon="info-circle" class="text-primary dark:text-blue-400" />
              Informações da Tarefa
            </h3>

            <div class="space-y-4">
              <div class="flex items-start gap-3">
                <div class="w-[40%]">
                  <p class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                    ID da Tarefa
                  </p>
                </div>
                <p class="text-sm text-gray-900 dark:text-gray-100 font-medium">
                  {{ loadedTicket.customId }}
                </p>
              </div>

              <div class="flex items-start gap-3">
                <div class="w-[40%]">
                  <p class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Status</p>
                </div>
                <span
                  :class="[
                    'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium max-w-[140px] sm:max-w-[220px]',
                    getStatusClass(ticketStatus),
                  ]"
                >
                  <font-awesome-icon
                    :icon="getStatusIcon(ticketStatus)"
                    class="text-xs mr-1.5 flex-shrink-0"
                  />
                  <span class="truncate">{{
                    ticketStatus ? formatSnakeToNaturalCase(ticketStatus) : '-'
                  }}</span>
                </span>
              </div>

              <!-- Priority -->
              <div class="flex items-start gap-3">
                <div class="w-[40%]">
                  <p class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                    Prioridade
                  </p>
                </div>
                <span
                  class="inline-flex items-center text-sm gap-1.5 text-gray-900 dark:text-gray-100"
                >
                  <font-awesome-icon
                    :icon="getPriorityIcon(loadedTicket.priority)"
                    :class="['text-sm pl-1.5', getPriorityClass(loadedTicket.priority)]"
                  />
                  {{ formatSnakeToNaturalCase(loadedTicket.priority) }}
                </span>
              </div>

              <!-- Requester -->
              <div class="flex items-start gap-3">
                <div class="w-[40%]">
                  <p class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                    Solicitante
                  </p>
                </div>
                <div class="flex-1 min-w-0">
                  <div class="flex items-center gap-2">
                    <div
                      class="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-semibold text-white shadow-sm"
                      :style="getAvatarStyle(loadedTicket.requester.department?.name || '')"
                    >
                      {{
                        getUserInitials({
                          firstName: loadedTicket.requester.firstName,
                          lastName: loadedTicket.requester.lastName,
                        })
                      }}
                    </div>
                    <p class="text-sm text-gray-900 dark:text-gray-100 font-medium">
                      {{ loadedTicket.requester.firstName }} {{ loadedTicket.requester.lastName }}
                    </p>
                  </div>
                </div>
              </div>

              <!-- Assignee -->
              <div class="flex items-start gap-3">
                <div class="w-[40%]">
                  <p class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                    Responsável
                  </p>
                </div>
                <div class="flex-1 min-w-0">
                  <div v-if="!isEditingAssignee">
                    <div v-if="sortedTargetUsers && sortedTargetUsers.length > 0">
                      <div
                        v-for="targetUser in sortedTargetUsers"
                        :key="targetUser.userId"
                        class="flex items-center justify-between cursor-pointer py-1 rounded-lg transition-colors"
                        @click="() => startEditingAssignee(targetUser.userId)"
                        :class="{ 'cursor-default': !canEditTicket }"
                        :title="canEditTicket ? 'Clique para alterar responsável' : ''"
                      >
                        <div class="flex-1 min-w-0">
                          <div
                            class="flex items-center gap-2"
                            :class="{
                              'font-semibold text-blue-600 dark:text-blue-400':
                                sortedTargetUsers.length > 1 &&
                                targetUser.userId === loadedTicket.currentTargetUserId,
                            }"
                          >
                            <div
                              class="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-semibold text-white shadow-sm"
                              :style="getAvatarStyle(targetUser.user.department?.name || '')"
                            >
                              {{
                                getUserInitials({
                                  firstName: targetUser.user.firstName,
                                  lastName: targetUser.user.lastName,
                                })
                              }}
                            </div>
                            <span class="text-sm"
                              >{{ targetUser.user.firstName }} {{ targetUser.user.lastName }}</span
                            >
                            <div
                              v-if="!targetUser.user.isActive"
                              class="flex items-center gap-1"
                              title="Conta desativada"
                            >
                              <font-awesome-icon
                                icon="exclamation-triangle"
                                class="text-orange-500 text-xs"
                              />
                              <span class="text-orange-500 text-xs">Desativado</span>
                            </div>
                          </div>
                          <p
                            v-if="targetUser.user.department?.name"
                            class="text-xs text-gray-500 dark:text-gray-400 ml-8 mt-0.5"
                          >
                            {{ targetUser.user.department.name }}
                          </p>
                        </div>
                        <font-awesome-icon
                          v-if="canEditTicket && isRequester"
                          icon="edit"
                          class="text-gray-400 text-xs"
                        />
                      </div>
                    </div>
                    <div
                      v-else
                      class="flex items-center justify-between cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 p-2 -m-2 rounded-lg transition-colors"
                      @click="() => startEditingAssignee()"
                      :class="{ 'cursor-default': !canEditTicket }"
                      :title="canEditTicket ? 'Clique para alterar responsável' : ''"
                    >
                      <div class="flex-1 min-w-0">
                        <p class="text-sm text-gray-900 dark:text-gray-100 font-medium">
                          {{ loadedTicket.currentTargetUser?.firstName }}
                          {{ loadedTicket.currentTargetUser?.lastName }}
                        </p>
                        <p
                          v-if="loadedTicket.currentTargetUser?.department?.name"
                          class="text-xs text-gray-500 dark:text-gray-400 mt-0.5"
                        >
                          {{ loadedTicket.currentTargetUser.department.name }}
                        </p>
                      </div>
                      <font-awesome-icon
                        v-if="canEditTicket && isRequester"
                        icon="edit"
                        class="text-gray-400 text-xs ml-1"
                      />
                    </div>
                  </div>

                  <div v-else class="space-y-3">
                    <DepartmentUserSelector
                      v-model="assigneeSelection"
                      @change="saveAssigneeChange"
                      placeholder="Selecionar responsável"
                      :excludedDepartmentIds="excludedDepartmentIds"
                    />
                    <div class="flex gap-2">
                      <button
                        @click="cancelEditingAssignee"
                        class="px-3 py-1.5 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-800 dark:text-gray-200 text-sm font-medium rounded-lg transition-colors"
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div class="flex items-start gap-3">
                <div class="w-[40%]">
                  <p class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Revisor</p>
                </div>
                <div v-if="loadedTicket.reviewer" class="flex-1 min-w-0">
                  <div class="flex items-center gap-2">
                    <div
                      class="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-semibold text-white shadow-sm"
                      :style="getAvatarStyle(loadedTicket.reviewer.department?.name || '')"
                    >
                      {{
                        getUserInitials({
                          firstName: loadedTicket.reviewer.firstName,
                          lastName: loadedTicket.reviewer.lastName,
                        })
                      }}
                    </div>
                    <p class="text-sm text-gray-900 dark:text-gray-100 font-medium">
                      {{ loadedTicket.reviewer.firstName }} {{ loadedTicket.reviewer.lastName }}
                    </p>
                  </div>
                  <p class="text-xs text-gray-500 dark:text-gray-400 ml-8">
                    {{ loadedTicket.reviewer.department?.name }}
                  </p>
                </div>
              </div>

              <!-- Category -->
              <div class="flex items-start gap-3">
                <div class="w-[40%]">
                  <p class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Categoria</p>
                </div>
                <div class="flex-1 min-w-0">
                  <span
                    v-if="loadedTicket.category?.name"
                    class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600"
                  >
                    {{ loadedTicket.category.name }}
                  </span>
                  <span v-else class="text-sm text-gray-900 dark:text-gray-100">-</span>
                </div>
              </div>

              <div class="flex items-start gap-3">
                <div class="w-[40%]">
                  <p class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Criado em</p>
                </div>
                <div class="flex-1 min-w-0">
                  <p
                    class="text-sm text-gray-900 dark:text-gray-100"
                    :title="loadedTicket.createdAt ? formatDateUtil(loadedTicket.createdAt) : ''"
                  >
                    {{ formatDateOnly(loadedTicket.createdAt) }}
                  </p>
                </div>
              </div>

              <div class="flex items-start gap-3">
                <div class="w-[40%]">
                  <p class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                    Concluir até
                  </p>
                </div>
                <p
                  class="text-sm text-gray-900 dark:text-gray-100"
                  :title="loadedTicket.dueAt ? formatDateUtil(loadedTicket.dueAt) : ''"
                >
                  {{ formatDateOnly(loadedTicket.dueAt) }}
                </p>
              </div>

              <div class="flex items-start gap-3">
                <div class="w-[40%]">
                  <p class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Prazo</p>
                </div>
                <div class="flex items-center gap-2">
                  <font-awesome-icon
                    v-if="
                      loadedTicket.dueAt &&
                      isDeadlineOverdue(loadedTicket.dueAt) &&
                      calculateDeadline(loadedTicket) &&
                      calculateDeadline(loadedTicket) !== ''
                    "
                    icon="exclamation-triangle"
                    class="text-red-500 text-xs"
                  />
                  <p
                    :class="[
                      'text-sm',
                      calculateDeadline(loadedTicket) && calculateDeadline(loadedTicket) !== ''
                        ? getDeadlineTextClass(loadedTicket.dueAt)
                        : 'text-gray-900 dark:text-gray-100',
                    ]"
                  >
                    {{ calculateDeadline(loadedTicket) || '-' }}
                  </p>
                </div>
              </div>

              <!-- Accepted Date -->
              <div class="flex items-start gap-3">
                <div class="w-[40%]">
                  <p class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Aceite em</p>
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-sm text-gray-900 dark:text-gray-100">
                    {{ formatDateOnly(loadedTicket.acceptedAt) }}
                  </p>
                </div>
              </div>

              <div class="flex items-start gap-3">
                <div class="w-[40%]">
                  <p class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                    Privacidade
                  </p>
                </div>
                <p class="text-sm text-gray-900 dark:text-gray-100">
                  {{ loadedTicket.isPrivate ? 'Privado' : 'Público' }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Content -->
        <div class="lg:col-span-2 overflow-y-auto pl-2">
          <div class="bg-white dark:bg-gray-800 pr-4 rounded-lg shadow-sm">
            <!-- Ticket Title Section -->
            <div class="p-4">
              <div v-if="!isEditingName">
                <h1
                  class="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-gray-100 leading-tight"
                  @click="startEditingName"
                  :class="{
                    'cursor-text hover:text-gray-600 dark:hover:text-gray-400 transition-colors':
                      isRequester,
                  }"
                  :title="isRequester ? 'Clique para editar' : ''"
                >
                  {{ loadedTicket.name }}
                </h1>
              </div>

              <div v-else class="space-y-4">
                <input
                  v-model="editingName"
                  class="w-full text-xl sm:text-2xl font-bold px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  @keyup.enter="saveTicketName"
                  @keyup.escape="cancelEditingName"
                  ref="nameInput"
                  placeholder="Nome da tarefa"
                />
                <div class="flex gap-3">
                  <button @click="saveTicketName" class="btn btn-primary">Salvar</button>
                  <button
                    @click="cancelEditingName"
                    class="btn px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 dark:text-gray-200 text-sm font-medium rounded-lg transition-colors"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
              <div class="flex items-center gap-2 mt-3">
                <button
                  v-if="canEditTicket"
                  class="inline-flex items-center justify-center px-2 py-1.5 border border-gray-300 dark:border-gray-600 gap-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm text-gray-600 dark:text-gray-100 rounded-md transition-colors whitespace-nowrap"
                  @click="openFileInput"
                  title="Anexar arquivo"
                >
                  <font-awesome-icon icon="paperclip" class="text-sm" /> Anexo
                </button>
                <button
                  v-if="canEditTicket"
                  class="inline-flex items-center justify-center px-2 py-1.5 border border-gray-300 dark:border-gray-600 gap-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm text-gray-600 dark:text-gray-100 rounded-md transition-colors whitespace-nowrap"
                  @click="scrollToTarefas"
                  title="Tarefas"
                >
                  <font-awesome-icon icon="tasks" class="text-sm" /> Subtarefas
                </button>
              </div>
            </div>

            <!-- Description Section -->
            <div class="my-2 px-4 sm:px-6 dark:border-gray-700">
              <h3
                class="font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2 mb-1"
              >
                <font-awesome-icon icon="align-left" class="text-gray-600 dark:text-gray-300" />
                Descrição
              </h3>

              <div v-if="!isEditingDescription">
                <div
                  class="description-text prose prose-sm max-w-none dark:prose-invert"
                  v-html="loadedTicket.description"
                  @click="startEditingDescription"
                  :class="{
                    'cursor-text hover:bg-gray-50 dark:hover:bg-gray-700 p-3 rounded-lg transition-colors':
                      isRequester,
                  }"
                  :title="isRequester ? 'Clique para editar' : ''"
                ></div>
              </div>

              <div v-else class="space-y-4">
                <div class="quill-wrapper">
                  <QuillEditor
                    :key="descriptionEditorKey"
                    v-model:content="editingDescription"
                    contentType="html"
                    theme="snow"
                    :options="editorOptions"
                  />
                </div>
                <div class="flex gap-3">
                  <button @click="saveTicketDescription" class="btn btn-primary">Salvar</button>
                  <button
                    @click="cancelEditingDescription"
                    class="btn px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 dark:text-gray-200 text-sm font-medium rounded-lg transition-colors"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </div>

            <!-- File Input (always present for functionality) -->
            <input class="hidden" type="file" ref="fileInput" multiple @change="handleFileChange" />

            <!-- Attachments Section -->
            <div
              v-if="loadedTicket.files.length > 0"
              class="p-4 sm:p-6 border-t border-gray-200 dark:border-gray-700"
            >
              <div class="flex items-center justify-between mb-4">
                <h3 class="font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                  <font-awesome-icon icon="paperclip" class="text-primary dark:text-blue-400" />
                  Anexos
                  <span
                    class="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 px-2 py-1 rounded-full text-xs font-medium"
                  >
                    {{ loadedTicket.files.length }}
                  </span>
                </h3>
                <button
                  v-if="canEditTicket"
                  class="inline-flex items-center justify-center w-8 h-8 bg-primary hover:bg-blue-700 text-white rounded-full transition-colors"
                  @click="openFileInput"
                  title="Adicionar anexos"
                >
                  <font-awesome-icon icon="plus" />
                </button>
              </div>

              <div class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                <div v-for="file in loadedTicket.files" :key="file.id" class="relative group">
                  <!-- Image Preview Card -->
                  <div
                    v-if="isImageFile(file)"
                    class="relative bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden cursor-pointer hover:border-gray-300 dark:hover:border-gray-500 transition-all aspect-[4/3] flex items-center justify-center max-w-[140px]"
                    @click="openImageViewer(file)"
                  >
                    <img
                      :src="file.url"
                      :alt="file.name"
                      class="w-full h-full object-cover"
                      @error="handleImageError"
                      @load="handleImageLoad"
                    />
                    <div
                      class="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors pointer-events-none"
                    ></div>
                    <div
                      class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2 pointer-events-none overflow-hidden"
                    >
                      <div
                        class="text-xs text-white whitespace-nowrap overflow-hidden text-ellipsis"
                      >
                        {{ truncateFileName(file.name) }}
                      </div>
                    </div>
                    <button
                      v-if="canEditTicket"
                      @click.stop="removeFile(file)"
                      class="absolute top-2 right-2 w-6 h-6 flex items-center justify-center text-white bg-red-500 hover:bg-red-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"
                      title="Remover arquivo"
                    >
                      <font-awesome-icon icon="times" class="text-xs" />
                    </button>
                  </div>
                  <!-- Non-Image File Card -->
                  <div
                    v-else
                    class="relative bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden cursor-pointer hover:border-gray-300 dark:hover:border-gray-500 transition-all aspect-[4/3] flex items-center justify-center max-w-[140px]"
                    @click="downloadFile(file)"
                  >
                    <div class="text-primary dark:text-blue-400">
                      <font-awesome-icon icon="file" size="3x" />
                    </div>
                    <div
                      class="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors pointer-events-none"
                    ></div>
                    <div
                      class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2 pointer-events-none overflow-hidden"
                    >
                      <div
                        class="text-xs text-white whitespace-nowrap overflow-hidden text-ellipsis"
                      >
                        {{ truncateFileName(file.name) }}
                      </div>
                    </div>
                    <button
                      v-if="canEditTicket"
                      @click.stop="removeFile(file)"
                      class="absolute top-2 right-2 w-6 h-6 flex items-center justify-center text-white bg-red-500 hover:bg-red-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"
                      title="Remover arquivo"
                    >
                      <font-awesome-icon icon="times" class="text-xs" />
                    </button>
                  </div>
                </div>

                <!-- Uploading File Placeholder -->
                <div
                  v-for="(file, i) in selectedFiles"
                  :key="`new-${i}`"
                  class="relative bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden aspect-[4/3] max-w-[140px]"
                >
                  <!-- Skeleton for image/file icon area -->
                  <div class="w-full h-full flex items-center justify-center p-4">
                    <div
                      class="w-12 h-12 bg-gray-200 dark:bg-gray-600 rounded-lg skeleton-shimmer"
                    ></div>
                  </div>
                  <!-- Skeleton for filename area -->
                  <div
                    class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2"
                  >
                    <div class="h-3 bg-gray-300 dark:bg-gray-500 rounded skeleton-shimmer"></div>
                  </div>
                </div>
              </div>
            </div>

            <div
              v-if="(showTarefasSection || checklistItems.length > 0) && loadedTicket"
              ref="tarefasSectionRef"
              id="tarefas-section"
            >
              <TicketChecklist
                :ticketId="loadedTicket.id"
                :items="checklistItems"
                :canEdit="canEditTicket"
                @update="loadChecklistItems"
                ref="ticketChecklistRef"
              />
            </div>

            <!-- Activities Section -->
            <div class="p-4 sm:p-6 border-t border-gray-200">
              <h3
                class="font-semibold text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-2"
              >
                <font-awesome-icon
                  :icon="['far', 'comment']"
                  class="text-gray-600 dark:text-gray-300"
                />
                Atividade
              </h3>

              <!-- Add Comment Form -->
              <div
                v-if="
                  ticketStatus === DefaultTicketStatus.InProgress ||
                  ticketStatus === DefaultTicketStatus.UnderVerification
                "
                class="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
              >
                <div class="space-y-4">
                  <div
                    class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600 overflow-hidden"
                  >
                    <QuillEditor
                      :key="editorKey"
                      ref="quillEditor"
                      v-model:content="newComment"
                      contentType="html"
                      theme="snow"
                      :options="editorOptions"
                      @text-change="handleQuillTextChange"
                    />
                  </div>
                  <div class="flex justify-end">
                    <button
                      @click="comment()"
                      :disabled="isCommentLoading"
                      class="inline-flex items-center gap-2 px-4 py-2 bg-primary hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <LoadingSpinner v-if="isCommentLoading" :size="16" />
                      <font-awesome-icon v-else icon="paper-plane" />
                      <span v-if="isCommentLoading">Enviando...</span>
                      <span v-else>Enviar Comentário</span>
                    </button>
                  </div>
                </div>
              </div>

              <div
                v-else
                class="mb-6 flex items-center gap-3 p-4 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300 rounded-lg border border-yellow-200 dark:border-yellow-800"
              >
                <font-awesome-icon icon="info-circle" />
                <p class="text-sm">
                  Comentários permitidos apenas para tarefas em andamento ou em verificação
                </p>
              </div>

              <!-- Timeline -->
              <div class="space-y-1 relative">
                <div
                  class="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-600 hidden sm:block"
                ></div>

                <div v-for="event in timeline" :key="event.data.id" class="relative">
                  <!-- Comment -->
                  <div v-if="event.type === 'comment'" class="flex gap-4 relative">
                    <div class="flex-1 min-w-0 pb-4 overflow-hidden">
                      <div
                        :class="[
                          'rounded-lg p-3 border overflow-hidden',
                          isMyComment(event.data.user.id)
                            ? 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                            : 'bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600',
                        ]"
                        :style="
                          isMyComment(event.data.user.id) && !userPreferencesStore.isDarkMode
                            ? {
                                backgroundColor: '#FAFBFD',
                                borderColor: '#E5E7EB',
                              }
                            : isMyComment(event.data.user.id) && userPreferencesStore.isDarkMode
                              ? {
                                  backgroundColor: '#2a3441',
                                  borderColor: '#374151',
                                }
                              : undefined
                        "
                      >
                        <div class="flex items-center gap-3 mb-1">
                          <div
                            class="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold text-white shadow-sm"
                            :style="getAvatarStyle(event.data.user.department?.name || '')"
                          >
                            {{
                              getUserInitials({
                                firstName: event.data.user.firstName,
                                lastName: event.data.user.lastName,
                              })
                            }}
                          </div>
                          <div class="flex items-center justify-between flex-1">
                            <span
                              :class="[
                                'font-medium',
                                isMyComment(event.data.user.id)
                                  ? 'text-gray-900 dark:text-gray-100'
                                  : 'text-gray-900 dark:text-gray-100',
                              ]"
                            >
                              {{ event.data.user.firstName }} {{ event.data.user.lastName }}
                            </span>
                            <div class="flex items-center gap-2">
                              <span class="text-sm text-gray-500 dark:text-gray-400">
                                {{ formatRelativeTime(event.createdAt) }}
                              </span>
                              <div
                                v-if="isMyComment(event.data.user.id)"
                                class="relative comment-menu-container"
                              >
                                <button
                                  @click.stop="
                                    openCommentMenuId =
                                      openCommentMenuId === event.data.uuid ? null : event.data.uuid
                                  "
                                  class="flex-shrink-0 w-6 h-6 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                                  title="Opções"
                                >
                                  <font-awesome-icon icon="ellipsis-vertical" class="text-xs" />
                                </button>
                                <div
                                  v-if="openCommentMenuId === event.data.uuid"
                                  class="absolute right-0 top-8 z-50 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg py-1 min-w-[120px]"
                                  @click.stop
                                >
                                  <button
                                    @click="handleDeleteCommentClick(event.data.uuid)"
                                    class="w-full px-4 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors flex items-center gap-2"
                                  >
                                    <font-awesome-icon icon="trash" class="text-xs" />
                                    Excluir
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div
                          class="comment-text prose prose-sm max-w-none dark:prose-invert ml-11"
                          style="font-size: 15px"
                          v-html="convertUrlsToLinks(event.data.content)"
                        ></div>
                      </div>
                    </div>
                  </div>

                  <!-- System Updates -->
                  <div v-else-if="event.type === 'specialUpdate'" class="flex gap-4 relative">
                    <div class="flex-1 min-w-0 pb-4">
                      <div
                        :class="[
                          'rounded-lg p-4 border',
                          event.subType === 'disapproval'
                            ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
                            : event.subType === 'cancellation'
                              ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
                              : event.subType === 'correction'
                                ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800'
                                : 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600',
                        ]"
                      >
                        <div class="flex items-center gap-3 mb-2">
                          <div
                            :class="[
                              'w-7 h-7 rounded-full flex items-center justify-center border-2 flex-shrink-0',
                              event.subType === 'disapproval'
                                ? 'bg-red-100 dark:bg-red-800 border-red-300 dark:border-red-700'
                                : event.subType === 'cancellation'
                                  ? 'bg-red-100 dark:bg-red-800 border-red-300 dark:border-red-700'
                                  : event.subType === 'correction'
                                    ? 'bg-yellow-100 dark:bg-yellow-800 border-yellow-300 dark:border-yellow-700'
                                    : 'bg-gray-100 dark:bg-gray-700 border-gray-200 dark:border-gray-600',
                            ]"
                          >
                            <span
                              :class="[
                                'text-xs font-medium',
                                event.subType === 'disapproval'
                                  ? 'text-red-600 dark:text-red-300'
                                  : event.subType === 'cancellation'
                                    ? 'text-red-600 dark:text-red-300'
                                    : event.subType === 'correction'
                                      ? 'text-yellow-600 dark:text-yellow-300'
                                      : 'text-gray-600 dark:text-gray-400',
                              ]"
                            >
                              {{ getUserInitials(loadedTicket?.requester) }}
                            </span>
                          </div>
                          <div class="flex items-center justify-between flex-1">
                            <span
                              :class="[
                                'font-medium',
                                event.subType === 'disapproval'
                                  ? 'text-red-900 dark:text-red-200'
                                  : event.subType === 'cancellation'
                                    ? 'text-red-900 dark:text-red-200'
                                    : event.subType === 'correction'
                                      ? 'text-yellow-900 dark:text-yellow-200'
                                      : 'text-gray-700 dark:text-gray-300',
                              ]"
                            >
                              {{ getSpecialUpdateTitle(event.subType, event) }}
                            </span>
                            <span class="text-sm text-gray-500 dark:text-gray-400">
                              {{ formatRelativeTime(event.createdAt) }}
                            </span>
                          </div>
                        </div>
                        <div
                          :class="[
                            'text-sm ml-11',
                            event.subType === 'disapproval'
                              ? 'text-red-700 dark:text-red-300'
                              : event.subType === 'cancellation'
                                ? 'text-red-700 dark:text-red-300'
                                : event.subType === 'correction'
                                  ? 'text-yellow-700 dark:text-yellow-300'
                                  : 'text-gray-600 dark:text-gray-400',
                          ]"
                        >
                          {{ event.data.content }}
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Regular Events -->
                  <div v-else class="flex gap-4 relative">
                    <div class="flex-1 min-w-0 pb-4">
                      <div
                        class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600"
                      >
                        <div class="flex items-center gap-3">
                          <div
                            class="w-7 h-7 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center text-gray-600 dark:text-gray-400 border-2 border-gray-200 dark:border-gray-600 flex-shrink-0"
                          >
                            <font-awesome-icon :icon="getEventIcon(event.data.description)" />
                          </div>
                          <div class="flex items-center justify-between flex-1">
                            <div
                              class="text-sm text-gray-600 dark:text-gray-400 flex-1"
                              v-html="formatTicketUpdateDescription(event.data)"
                            ></div>
                            <span
                              class="text-sm text-gray-500 dark:text-gray-400 ml-4 flex-shrink-0"
                            >
                              {{ formatRelativeTime(event.createdAt) }}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </BaseModal>

  <!-- Image Viewer Modal -->
  <div
    v-if="selectedImage"
    class="fixed inset-0 z-[10001] bg-black/90 flex items-center justify-center"
    @click="closeImageViewer"
  >
    <div class="relative max-w-[90vw] max-h-[90vh] flex items-center justify-center">
      <button
        @click="closeImageViewer"
        class="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center text-white bg-black/50 hover:bg-black/70 rounded-full transition-colors"
        title="Fechar (ESC)"
      >
        <font-awesome-icon icon="times" class="text-xl" />
      </button>
      <button
        v-if="hasPreviousImage"
        @click.stop="previousImage"
        class="absolute left-4 z-10 w-10 h-10 flex items-center justify-center text-white bg-black/50 hover:bg-black/70 rounded-full transition-colors"
        title="Imagem anterior (←)"
      >
        <font-awesome-icon icon="chevron-left" class="text-xl" />
      </button>
      <button
        v-if="hasNextImage"
        @click.stop="nextImage"
        class="absolute right-4 z-10 w-10 h-10 flex items-center justify-center text-white bg-black/50 hover:bg-black/70 rounded-full transition-colors"
        title="Próxima imagem (→)"
      >
        <font-awesome-icon icon="chevron-right" class="text-xl" />
      </button>
      <img
        :src="selectedImage.url"
        :alt="selectedImage.name"
        class="max-w-full max-h-[90vh] object-contain"
        @click.stop
      />
      <div
        class="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-lg text-sm"
      >
        {{ selectedImage.name }} ({{ currentImageIndex + 1 }} / {{ imageFiles.length }})
      </div>
    </div>
  </div>

  <ConfirmationModal
    v-if="confirmationModal.isOpen"
    :title="confirmationModal.title"
    :message="confirmationModal.message"
    :hasInput="confirmationModal.hasInput"
    :reasonOptions="confirmationModal.reasonOptions"
    :showUserSelector="confirmationModal.showUserSelector"
    :targetUsers="confirmationModal.targetUsers"
    :loading="confirmationModal.isLoading"
    @confirm="handleConfirm"
    @cancel="handleCancel"
  />

  <BaseModal
    v-if="showReviewerModal"
    title="Selecione o Revisor"
    :showFooter="true"
    @close="showReviewerModal = false"
  >
    <div class="p-4">
      <select
        v-model="reviewerSelection"
        class="w-full border rounded px-3 py-2 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700"
      >
        <option value="" disabled selected>Selecione o revisor</option>
        <option v-for="admin in tenantAdmins" :key="admin.id" :value="admin.id">
          {{ admin.firstName }} {{ admin.lastName }}
        </option>
      </select>
    </div>
    <template #footer>
      <div class="flex justify-end gap-2">
        <button
          class="px-4 py-2 bg-gray-200 dark:bg-gray-600 rounded text-gray-800 dark:text-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
          @click="showReviewerModal = false"
          :disabled="isReviewerModalLoading"
        >
          Cancelar
        </button>
        <button
          class="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 min-w-[100px]"
          @click="confirmReviewerSelection"
          :disabled="isReviewerModalLoading"
        >
          <LoadingSpinner v-if="isReviewerModalLoading" :size="16" />
          <span v-if="!isReviewerModalLoading">Confirmar</span>
        </button>
      </div>
    </template>
  </BaseModal>

  <!-- Due Date Modal -->
  <BaseModal
    v-if="showDueDateModal"
    title="Definir Prazo de Conclusão"
    :showFooter="true"
    @close="showDueDateModal = false"
  >
    <div class="p-4">
      <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
        Esta tarefa não possui um prazo definido. Para aceitar a tarefa, defina uma data estimada de
        conclusão:
      </p>
      <div class="flex flex-col gap-2">
        <label for="dueDate" class="text-sm font-medium text-gray-700 dark:text-gray-300">
          Data de Conclusão:
        </label>
        <div class="w-full">
          <DatePicker
            :value="dueDateValue"
            type="datetime"
            format="DD/MM/YYYY HH:mm"
            value-type="format"
            :lang="pt"
            :placeholder="'Selecione data e hora'"
            :clearable="true"
            :editable="false"
            :disabled-date="disabledWeekendDate"
            @change="handleDatePickerChange"
            :input-class="'w-full px-[14px] py-2.5 border border-gray-200 dark:border-gray-700 rounded text-sm text-gray-800 dark:text-white bg-white dark:bg-gray-800'"
            :placeholder-class="'text-gray-500 dark:text-gray-400'"
            :time-picker-options="{
              start: '00:00',
              step: '00:15',
              end: '23:45',
            }"
          />
        </div>
      </div>
    </div>
    <template #footer>
      <div class="flex justify-end gap-2">
        <button
          class="px-4 py-2 bg-gray-200 dark:bg-gray-600 rounded text-gray-800 dark:text-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
          @click="showDueDateModal = false"
          :disabled="isDueDateModalLoading"
        >
          Cancelar
        </button>
        <button
          class="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 min-w-[100px]"
          @click="confirmDueDate"
          :disabled="!dueDateValue || isDueDateModalLoading"
        >
          <LoadingSpinner v-if="isDueDateModalLoading" :size="16" />
          <span v-if="!isDueDateModalLoading">Confirmar</span>
        </button>
      </div>
    </template>
  </BaseModal>

  <!-- Image Viewer Modal -->
  <div
    v-if="selectedImage"
    class="fixed inset-0 z-[10001] bg-black/90 flex items-center justify-center"
    @click="closeImageViewer"
  >
    <!-- Action buttons - fixed to top right of screen -->
    <div class="fixed top-4 right-4 z-10 flex items-center gap-2">
      <button
        @click.stop="downloadImage"
        class="w-10 h-10 flex items-center justify-center text-white bg-black/50 hover:bg-black/70 rounded-full transition-colors"
        title="Baixar imagem"
      >
        <font-awesome-icon icon="download" class="text-xl" />
      </button>
      <button
        @click="closeImageViewer"
        class="w-10 h-10 flex items-center justify-center text-white bg-black/50 hover:bg-black/70 rounded-full transition-colors"
        title="Fechar (ESC)"
      >
        <font-awesome-icon icon="times" class="text-xl" />
      </button>
    </div>

    <!-- Navigation buttons - fixed to left and right of screen -->
    <button
      v-if="hasPreviousImage"
      @click.stop="previousImage"
      class="fixed left-5 top-1/2 transform -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center text-white bg-black/50 hover:bg-black/70 rounded-full transition-colors"
      title="Imagem anterior (←)"
    >
      <font-awesome-icon icon="chevron-left" class="text-xl" />
    </button>
    <button
      v-if="hasNextImage"
      @click.stop="nextImage"
      class="fixed right-5 top-1/2 transform -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center text-white bg-black/50 hover:bg-black/70 rounded-full transition-colors"
      title="Próxima imagem (→)"
    >
      <font-awesome-icon icon="chevron-right" class="text-xl" />
    </button>

    <!-- Image container -->
    <div class="relative max-w-[90vw] max-h-[90vh] flex items-center justify-center">
      <img
        :src="selectedImage.url"
        :alt="selectedImage.name"
        class="max-w-full max-h-[90vh] object-contain"
        @click.stop
      />
    </div>

    <!-- Image name - fixed to bottom of screen -->
    <div
      class="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-lg text-sm z-10"
    >
      {{ selectedImage.name }} ({{ currentImageIndex + 1 }} / {{ imageFiles.length }})
    </div>
  </div>
</template>

<script setup lang="ts">
import BaseModal from '../common/BaseModal.vue';
import Input from '../common/Input.vue';
import { CancellationReason, DefaultTicketStatus, type Ticket, type TicketComment } from '@/models';
import type { ChecklistItem } from '@/models/checklist';
import { checklistService } from '@/services/checklistService';
import { ref, computed, watch, nextTick, onMounted, onUnmounted } from 'vue';
import { ticketCommentService } from '@/services/ticketCommentService';
import { ticketService } from '@/services/ticketService';
import { userService } from '@/services/userService';
import { useUserStore } from '@/stores/user';
import { useTicketsStore } from '@/stores/tickets';
import { useUserPreferencesStore } from '@/stores/userPreferences';
import { toast } from 'vue3-toastify';
import { formatRelativeTime, formatDate as formatDateUtil } from '@/utils/date';
import ConfirmationModal from '../common/ConfirmationModal.vue';
import {
  calculateDeadline,
  formatSnakeToNaturalCase,
  getUserInitials,
  getAvatarColor,
  getAvatarStyle,
  enumToOptions,
  getDeadlineInfo,
} from '@/utils/generic-helper';
import type { TicketUpdate } from '@/models/ticketUpdate';
import { TicketUpdateService } from '@/services/ticketUpdateService';
import type { TicketFile } from '@/models/ticketFile';
import { awsService } from '@/services/awsService';
import axios from 'axios';
import { CorrectionReason, DisapprovalReason } from '@/models';
import { QuillEditor } from '@vueup/vue-quill';
import '@vueup/vue-quill/dist/vue-quill.snow.css';
import DepartmentUserSelector from '@/components/common/DepartmentUserSelector.vue';
import LoadingSpinner from '@/components/common/LoadingSpinner.vue';
import TicketChecklist from './TicketChecklist.vue';
import DatePicker from 'vue-datepicker-next';
import 'vue-datepicker-next/index.css';
import pt from 'vue-datepicker-next/locale/pt-br.es';

interface SpecialUpdateEvent {
  data?: {
    reason?: string;
    content?: string;
    id?: string | number;
  };
}

const props = defineProps<{
  ticketCustomId: string | null;
}>();

const emit = defineEmits(['close']);
const userStore = useUserStore();
const ticketsStore = useTicketsStore();
const userPreferencesStore = useUserPreferencesStore();
const newComment = ref('');
const quillEditor = ref<any>(null);
const editorKey = ref(0);
const isCommentLoading = ref(false);
const comments = ref<TicketComment[]>([]);
const ticketUpdates = ref<TicketUpdate[]>([]);
const loadedTicket = ref<Ticket | null>(null);
const isLoadingTicket = ref(false);
const hasLoadedTicketOnce = ref(false);
const selectedFiles = ref<File[]>([]);
const fileInput = ref<HTMLInputElement | null>(null);
const isUploading = ref(false);
const checklistItems = ref<ChecklistItem[]>([]);
const showTarefasSection = ref(false);
const tarefasSectionRef = ref<HTMLElement | null>(null);
const ticketChecklistRef = ref<InstanceType<typeof TicketChecklist> | null>(null);

// Image viewer state
const selectedImage = ref<TicketFile | null>(null);
const currentImageIndex = ref(0);

// Editing states
const isEditingName = ref(false);
const isEditingDescription = ref(false);
const editingName = ref('');
const editingDescription = ref('');
const descriptionEditorKey = ref(0);
const nameInput = ref<HTMLInputElement | null>(null);

// Comment menu state
const openCommentMenuId = ref<string | null>(null);

const confirmationModal = ref({
  isOpen: false,
  title: '',
  message: '',
  action: null as
    | ((data?: { reason: string; description: string; targetUserId?: number }) => Promise<void>)
    | null,
  hasInput: false,
  reasonOptions: [] as { value: string; label: string }[],
  context: '', // add context property
  showUserSelector: false,
  targetUsers: [] as Array<{ userId: number; userName: string; order: number }>,
  isLoading: false,
});

const editorOptions = {
  modules: {
    toolbar: [
      [{ size: ['small', false, 'large'] }],
      [{ header: [1, 2, 3, false] }],
      ['bold', 'italic', 'underline'],
      ['blockquote', 'code-block'],
      [{ list: 'ordered' }, { list: 'bullet' }, { list: 'check' }],
      ['link', 'image', 'video'],
    ],
  },
  placeholder: 'Adicionar comentário...',
};

const dataUrlToBlob = (dataUrl: string) => {
  const arr = dataUrl.split(',');
  const mimeMatch = arr[0].match(/:(.*?);/);
  const mime = mimeMatch ? mimeMatch[1] : 'image/png';
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return { blob: new Blob([u8arr], { type: mime }), mime };
};

const uploadInlineImage = async (dataUrl: string) => {
  const { blob, mime } = dataUrlToBlob(dataUrl);
  const ext = mime.split('/')[1] || 'png';
  // Generate a filename for inline images since we don't have the original name
  const fileName = `image_${Date.now()}.${ext}`;
  const { data } = await awsService.getSignedUrl(fileName);
  await axios.put(data.url, blob, {
    headers: {
      'Content-Type': mime,
    },
  });
  return data.url.split('?')[0];
};

const convertUrlsToLinks = (html: string): string => {
  if (typeof window === 'undefined' || !html) return html;

  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = html;

  const urlRegex =
    /(https?:\/\/[^\s<>"{}|\\^`[\]]+|www\.[^\s<>"{}|\\^`[\]]+|[a-zA-Z0-9-]+\.[a-zA-Z]{2,}[^\s<>"{}|\\^`[\]]*)/gi;

  const processNode = (node: Node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent || '';
      const parent = node.parentNode;

      if (
        parent &&
        (parent.nodeName === 'A' || (parent instanceof Element && parent.closest('a')))
      ) {
        return;
      }

      const matches = Array.from(text.matchAll(urlRegex));
      if (matches.length > 0) {
        const fragment = document.createDocumentFragment();
        let lastIndex = 0;

        matches.forEach((match) => {
          const url = match[0];
          const index = match.index || 0;

          if (index > lastIndex) {
            fragment.appendChild(document.createTextNode(text.substring(lastIndex, index)));
          }

          const link = document.createElement('a');
          let href = url;
          if (!url.startsWith('http://') && !url.startsWith('https://')) {
            href = url.startsWith('www.') ? `https://${url}` : `https://${url}`;
          }
          link.href = href;
          link.target = '_blank';
          link.rel = 'noopener noreferrer';
          link.textContent = url;
          link.className = 'text-blue-600 dark:text-blue-400 hover:underline';

          fragment.appendChild(link);
          lastIndex = index + url.length;
        });

        if (lastIndex < text.length) {
          fragment.appendChild(document.createTextNode(text.substring(lastIndex)));
        }

        if (parent) {
          parent.replaceChild(fragment, node);
        }
      }
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      const element = node as Element;
      if (
        element.tagName === 'SCRIPT' ||
        element.tagName === 'STYLE' ||
        element.tagName === 'A' ||
        element.closest('a')
      ) {
        return;
      }

      const childNodes = Array.from(node.childNodes);
      childNodes.forEach(processNode);
    }
  };

  const childNodes = Array.from(tempDiv.childNodes);
  childNodes.forEach(processNode);

  return tempDiv.innerHTML;
};

const processRichTextContent = async (html: string) => {
  if (typeof window === 'undefined' || !html) return html;

  let processedHtml = convertUrlsToLinks(html);

  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = processedHtml;

  const images = Array.from(tempDiv.querySelectorAll('img'));
  for (const img of images) {
    const src = img.getAttribute('src');
    if (src && src.startsWith('data:')) {
      try {
        const uploadedUrl = await uploadInlineImage(src);
        img.setAttribute('src', uploadedUrl);
      } catch (error) {
        console.error('Erro ao enviar imagem embutida:', error);
        toast.error('Erro ao enviar imagem do comentário. Tente novamente.');
        throw error;
      }
    }
  }

  return tempDiv.innerHTML;
};

const closeModal = () => {
  // Check if ticket is returned and user is target user
  if (
    ticketStatus.value === DefaultTicketStatus.Returned &&
    isTargetUser.value &&
    !confirmationModal.value.isOpen
  ) {
    openConfirmationModal(
      'Iniciar Correção',
      'Esta tarefa foi devolvida para correção. Deseja iniciar as correções agora?',
      async () => {
        await startCorrectionDirectly(loadedTicket.value!.customId);
      },
      false,
      [],
      'start-correction',
    );
    return;
  }

  showTarefasSection.value = false;
  emit('close');
};

const formatDate = (date?: string) => {
  if (!date) return '—';
  const dateObj = new Date(date);
  const day = dateObj.getDate().toString().padStart(2, '0');
  const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
  const year = dateObj.getFullYear();
  return `${day}/${month}/${year}`;
};

const getPriorityClass = (priority: string) => {
  switch (priority) {
    case 'baixa':
      return 'text-green-500';
    case 'média':
      return 'text-orange-500';
    case 'alta':
      return 'text-red-500';
    default:
      return 'text-gray-500';
  }
};

const getStatusClass = (status: string) => {
  switch (status) {
    case DefaultTicketStatus.Pending:
      return 'bg-orange-100 text-orange-800 border border-orange-200 dark:bg-orange-900/30 dark:text-orange-300 dark:border-orange-800';
    case DefaultTicketStatus.InProgress:
      return 'bg-blue-100 text-blue-800 border border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800';
    case DefaultTicketStatus.AwaitingVerification:
    case DefaultTicketStatus.UnderVerification:
      return 'bg-purple-100 text-purple-800 border border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800';
    case DefaultTicketStatus.Completed:
      return 'bg-green-100 text-green-800 border border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800';
    case DefaultTicketStatus.Rejected:
      return 'bg-red-100 text-red-800 border border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800';
    case DefaultTicketStatus.Returned:
      return 'bg-orange-100 text-orange-800 border border-orange-200 dark:bg-orange-900/30 dark:text-orange-300 dark:border-orange-800';
    case DefaultTicketStatus.Canceled:
      return 'bg-red-100 text-red-800 border border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800';
    default:
      return 'bg-gray-100 text-gray-800 border border-gray-200 dark:bg-gray-900/30 dark:text-gray-300 dark:border-gray-800';
  }
};

const getDeadlineInfoFromDate = (date?: string) => {
  if (!date) return null;
  const info = getDeadlineInfo(date);
  return info.isValid ? info : null;
};

const isPastDeadline = (date?: string) => {
  const info = getDeadlineInfoFromDate(date);
  return info ? info.isOverdue || info.businessDaysRemaining <= 2 : false;
};

const getDeadlineClass = (date?: string) => {
  const info = getDeadlineInfoFromDate(date);
  if (!info) return '';

  if (info.isOverdue || info.businessDaysRemaining <= 2) {
    return 'deadline-danger';
  }

  return 'deadline-normal';
};

const getDeadlineTextClass = (date?: string) => {
  const info = getDeadlineInfoFromDate(date);
  if (!info) return 'text-gray-900 dark:text-gray-100';

  if (info.isOverdue) return 'text-red-600 dark:text-red-400';
  // Red when 6 hours or less remaining
  if (!info.isOverdue && info.hoursDifference <= 6) return 'text-red-600 dark:text-red-400';
  if (info.businessDaysRemaining <= 2) return 'text-orange-500 dark:text-orange-400';
  return 'text-green-600 dark:text-green-400';
};

const isDeadlineOverdue = (date?: string) => {
  const info = getDeadlineInfoFromDate(date);
  return info ? info.isOverdue : false;
};

const openConfirmationModal = (
  title: string,
  message: string,
  action: (data?: { reason: string; description: string; targetUserId?: number }) => Promise<void>,
  hasInput = false,
  reasonOptions: { value: string; label: string }[] = [],
  context = '',
  showUserSelector = false,
  targetUsers: Array<{ userId: number; userName: string; order: number }> = [],
) => {
  confirmationModal.value = {
    isOpen: true,
    title,
    message,
    action,
    hasInput,
    reasonOptions,
    context,
    showUserSelector,
    targetUsers,
    isLoading: false,
  };
};

const closeConfirmationModal = () => {
  confirmationModal.value.isOpen = false;
  confirmationModal.value.action = null;
  confirmationModal.value.isLoading = false;
};

const handleConfirm = async (data?: {
  reason: string;
  description: string;
  targetUserId?: number;
}) => {
  if (confirmationModal.value.action) {
    confirmationModal.value.isLoading = true;

    try {
      if (data) {
        await confirmationModal.value.action(data);
      } else {
        await confirmationModal.value.action();
      }
    } finally {
      confirmationModal.value.isLoading = false;
    }
  }
  closeConfirmationModal();
};

const handleCancel = () => {
  if (confirmationModal.value.context === 'start-verification') {
    closeConfirmationModal();
    closeModal(); // Also close the ticket details modal
  } else if (confirmationModal.value.context === 'start-correction') {
    closeConfirmationModal();
    emit('close'); // Close the ticket details modal without starting correction
  } else {
    closeConfirmationModal();
  }
  confirmationModal.value.context = '';
};

const acceptTicket = async (ticketId: string) => {
  if (loadedTicket.value && !loadedTicket.value.dueAt) {
    showDueDateModal.value = true;
    return;
  }

  openConfirmationModal(
    'Aceitar Tarefa',
    'Tem certeza que deseja aceitar esta tarefa?',
    async () => {
      try {
        await ticketService.accept(ticketId);
        toast.success('Tarefa aceita com sucesso');

        refreshSelectedTicket();
      } catch {
        toast.error('Erro ao aceitar a tarefa');
      }
    },
  );
};

const sendToNextDepartment = async (ticketId: string) => {
  openConfirmationModal(
    'Enviar para Próximo Setor',
    'Tem certeza que deseja enviar esta tarefa para o próximo setor?',
    async () => {
      try {
        await ticketService.sendToNextDepartment(ticketId);
        toast.success('Tarefa enviada para o próximo setor');

        refreshSelectedTicket();
      } catch {
        toast.error('Erro ao enviar a tarefa para o próximo setor');
      }
    },
  );
};

const sendForReview = async (ticketId: string) => {
  if (
    loadedTicket.value &&
    loadedTicket.value.requester.id === loadedTicket.value.currentTargetUserId &&
    !loadedTicket.value.reviewer
  ) {
    await fetchTenantAdmins();
    showReviewerModal.value = true;
    return;
  }
  openConfirmationModal(
    'Enviar Para Revisão',
    'Tem certeza que deseja enviar esta tarefa para revisão?',
    async () => {
      try {
        await ticketService.updateStatus(ticketId, {
          status: DefaultTicketStatus.AwaitingVerification,
        });
        toast.success('Tarefa enviada para revisão');

        refreshSelectedTicket();
      } catch {
        toast.error('Erro ao enviar a tarefa para revisão');
      }
    },
  );
};

const approveTicket = async (ticketId: string) => {
  openConfirmationModal(
    'Aprovar Tarefa',
    'Tem certeza que deseja aprovar esta tarefa?',
    async () => {
      try {
        await ticketService.approve(ticketId);
        toast.success('Tarefa aprovada com sucesso');

        if (loadedTicket.value) {
          refreshSelectedTicket();
        } else {
          await ticketsStore.fetchTicketDetails(ticketId);
        }
      } catch {
        toast.error('Erro ao aprovar a tarefa');
      }
    },
  );
};

const requestCorrection = async (ticketId: string) => {
  if (!loadedTicket.value) return;

  const reasonOptions = enumToOptions(CorrectionReason);

  // Prepare target users for the selector if multiple users exist
  const showUserSelector =
    loadedTicket.value.targetUsers && loadedTicket.value.targetUsers.length > 1;
  const targetUsers = showUserSelector
    ? [...loadedTicket.value.targetUsers]
        .sort((a, b) => a.order - b.order)
        .map((tu) => ({
          userId: tu.userId,
          userName: `${tu.user.firstName} ${tu.user.lastName}`,
          order: tu.order,
          departmentName: tu.user.department?.name || '',
        }))
    : [];

  openConfirmationModal(
    'Solicitar Correção',
    'Por favor, preencha os detalhes da correção necessária:',
    async (data?: { reason: string; description: string; targetUserId?: number }) => {
      try {
        await ticketService.requestCorrection(ticketId, {
          reason: data?.reason ?? '',
          details: data?.description ?? '',
          targetUserId: data?.targetUserId,
        });

        toast.success('Correção solicitada com sucesso');

        refreshSelectedTicket();
      } catch {
        toast.error('Erro ao solicitar correção');
      }
    },
    true,
    reasonOptions,
    '',
    showUserSelector,
    targetUsers,
  );
};

const correctTicket = async (ticketId: string) => {
  openConfirmationModal(
    'Corrigir Tarefa',
    'Tem certeza que deseja iniciar as correções desta tarefa?',
    async () => {
      try {
        await ticketService.updateStatus(ticketId, { status: DefaultTicketStatus.InProgress });
        toast.success('Tarefa em correção');
        refreshSelectedTicket();
      } catch {
        toast.error('Erro ao iniciar correção');
      }
    },
  );
};

const startCorrectionDirectly = async (ticketId: string) => {
  try {
    await ticketService.updateStatus(ticketId, { status: DefaultTicketStatus.InProgress });
    toast.success('Tarefa em correção');
    refreshSelectedTicket();
  } catch {
    toast.error('Erro ao iniciar correção');
  }
};

const rejectTicket = async (ticketId: string) => {
  const reasonOptions = enumToOptions(DisapprovalReason);
  openConfirmationModal(
    'Reprovar Tarefa',
    'Por favor, informe o motivo da reprovação:',
    async (data?: { reason: string; description: string }) => {
      try {
        await ticketService.reject(ticketId, {
          reason: data?.reason ?? '',
          details: data?.description ?? '',
        });

        toast.success('Tarefa reprovada com sucesso');

        refreshSelectedTicket();
      } catch {
        toast.error('Erro ao reprovar a tarefa');
      }
    },
    true,
    reasonOptions,
  );
};

const cancelTicket = async (ticketId: string) => {
  const reasonOptions = enumToOptions(CancellationReason);
  openConfirmationModal(
    'Cancelar Tarefa',
    'Por favor, informe o motivo do cancelamento:',
    async (data?: { reason: string; description: string }) => {
      try {
        await ticketService.cancel(ticketId, {
          reason: data?.reason ?? '',
          details: data?.description ?? '',
        });

        toast.success('Tarefa cancelada com sucesso');

        refreshSelectedTicket();

        emit('close');
      } catch {
        toast.error('Erro ao cancelar a tarefa');
      }
    },
    true,
    reasonOptions,
  );
};

const isImageFile = (file: TicketFile): boolean => {
  // Check mimeType first if available and not empty
  if (file.mimeType && file.mimeType.trim() && file.mimeType.startsWith('image/')) {
    return true;
  }

  // Check file extension in name
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.bmp', '.ico'];
  const fileName = file.name.toLowerCase().trim();
  const fileUrl = (file.url || '').toLowerCase().trim();

  // Check if filename or URL ends with any image extension
  const hasImageExtension = imageExtensions.some(
    (ext) => fileName.endsWith(ext) || fileUrl.includes(ext),
  );

  return hasImageExtension;
};

const imageFiles = computed(() => {
  if (!loadedTicket.value) return [];
  return loadedTicket.value.files.filter((file) => isImageFile(file));
});

const hasPreviousImage = computed(() => {
  return currentImageIndex.value > 0;
});

const hasNextImage = computed(() => {
  return currentImageIndex.value < imageFiles.value.length - 1;
});

const openImageViewer = (file: TicketFile) => {
  if (!isImageFile(file)) {
    downloadFile(file);
    return;
  }

  const index = imageFiles.value.findIndex((f) => f.id === file.id);
  if (index !== -1) {
    currentImageIndex.value = index;
    selectedImage.value = file;
    // Prevent body scroll when image viewer is open
    document.body.style.overflow = 'hidden';
  }
};

const closeImageViewer = () => {
  selectedImage.value = null;
  currentImageIndex.value = 0;
  document.body.style.overflow = '';
};

const previousImage = () => {
  if (hasPreviousImage.value) {
    currentImageIndex.value--;
    selectedImage.value = imageFiles.value[currentImageIndex.value];
  }
};

const nextImage = () => {
  if (hasNextImage.value) {
    currentImageIndex.value++;
    selectedImage.value = imageFiles.value[currentImageIndex.value];
  }
};

const handleImageLoad = () => {
  // Image loaded successfully
};

const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement;
  // Hide the broken image
  img.style.display = 'none';
};

const truncateFileName = (fileName: string, maxLength: number = 19): string => {
  if (!fileName) return '';

  const lastDotIndex = fileName.lastIndexOf('.');
  if (lastDotIndex === -1) {
    if (fileName.length <= maxLength) {
      return fileName;
    }
    return fileName.substring(0, maxLength - 3) + '...';
  }

  const extension = fileName.substring(lastDotIndex);
  const nameWithoutExt = fileName.substring(0, lastDotIndex);

  if (fileName.length <= maxLength) {
    return fileName;
  }

  const lastThreeChars =
    nameWithoutExt.length >= 3
      ? nameWithoutExt.substring(nameWithoutExt.length - 3)
      : nameWithoutExt;

  const neededLength = 3 + 3 + extension.length;

  if (maxLength < neededLength) {
    return '...' + lastThreeChars + extension;
  }

  const availableLength = maxLength - 3 - 3 - extension.length;

  if (availableLength <= 0) {
    return '...' + lastThreeChars + extension;
  }

  return nameWithoutExt.substring(0, availableLength) + '...' + lastThreeChars + extension;
};

const downloadFile = async (file: TicketFile) => {
  try {
    await awsService.downloadFile(file.url, file.name);
  } catch (error) {
    console.error('Error downloading file:', error);
    toast.error('Erro ao baixar arquivo');
  }
};

const downloadImage = () => {
  if (!selectedImage.value) return;
  downloadFile(selectedImage.value);
};

const removeFile = async (file: TicketFile) => {
  if (!loadedTicket.value) return;

  try {
    await ticketService.deleteFile(file.id);
    refreshSelectedTicket();
  } catch {
    toast.error('Erro ao remover arquivo');
  }
};

// Handle Quill editor text changes - convert URLs to links when user finishes typing
const handleQuillTextChange = () => {
  // We'll process URLs when saving instead of real-time to avoid interfering with typing
  // This is handled in processRichTextContent
};

const comment = async () => {
  // Create a temporary div to strip HTML and check if content is actually empty
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = newComment.value;
  const textContent = tempDiv.textContent || tempDiv.innerText || '';

  const hasImages = tempDiv.querySelectorAll('img').length > 0;
  const hasVideos = tempDiv.querySelectorAll('video').length > 0;
  const hasContent = textContent.trim() || hasImages || hasVideos;

  if (!hasContent) {
    toast.error('Comentário não pode estar vazio');
    return;
  }

  if (isCommentLoading.value) return; // Prevent double submission

  isCommentLoading.value = true;

  try {
    const processedContent = await processRichTextContent(newComment.value);

    await ticketCommentService.create({
      ticketId: loadedTicket.value!.id,
      ticketCustomId: loadedTicket.value!.customId,
      userId: userStore.user!.id,
      content: processedContent,
    });

    // Clear the editor immediately after successful submission
    newComment.value = '';
    editorKey.value += 1; // Force component re-render

    // Fetch comments and ticket details in parallel (non-blocking)
    Promise.all([
      fetchComments(),
      loadedTicket.value?.customId
        ? ticketsStore.fetchTicketDetails(loadedTicket.value.customId)
        : Promise.resolve(),
    ]).catch((error) => {
      console.error('Error refreshing comments/ticket:', error);
    });
  } catch {
    toast.error('Erro ao adicionar comentário');
  } finally {
    isCommentLoading.value = false;
  }
};

const fetchComments = async () => {
  try {
    if (loadedTicket.value) {
      const response = await ticketCommentService.getByTicket(loadedTicket.value.customId);
      comments.value = response.data;
    }
  } catch {
    toast.error('Erro ao buscar comentários');
  }
};

const handleDeleteCommentClick = (commentUuid: string) => {
  openCommentMenuId.value = null;
  openConfirmationModal(
    'Excluir Comentário',
    'Tem certeza que deseja excluir este comentário? Esta ação não pode ser desfeita.',
    async () => {
      try {
        await ticketCommentService.delete(commentUuid);
        toast.success('Comentário excluído com sucesso');
        fetchComments();
      } catch {
        toast.error('Erro ao excluir comentário');
      }
    },
  );
};

const fetchTicketUpdates = async () => {
  try {
    if (loadedTicket.value) {
      const response = await TicketUpdateService.getByTicket(loadedTicket.value.customId);
      ticketUpdates.value = response.data;
    }
  } catch (err) {
    console.error(err);
  }
};

const timeline = computed(() => {
  const commentEvents = comments.value.map((comment) => ({
    type: 'comment' as const,
    createdAt: comment.createdAt,
    data: comment,
  }));

  const updateEvents = ticketUpdates.value.map((update) => ({
    type: 'update' as const,
    createdAt: update.createdAt,
    data: update,
  }));

  const specialUpdateEvents = [];

  if (loadedTicket.value?.disapprovalReason) {
    specialUpdateEvents.push({
      type: 'specialUpdate' as const,
      subType: 'disapproval',
      createdAt: loadedTicket.value.disapprovalReason.createdAt,
      data: {
        id: `disapproval-${loadedTicket.value.id}`,
        content: loadedTicket.value.disapprovalReason.details,
        reason: loadedTicket.value.disapprovalReason.reason,
      },
    });
  }

  if (loadedTicket.value?.cancellationReason) {
    specialUpdateEvents.push({
      type: 'specialUpdate' as const,
      subType: 'cancellation',
      createdAt: loadedTicket.value.cancellationReason.createdAt,
      data: {
        id: `cancellation-${loadedTicket.value.id}`,
        content: loadedTicket.value.cancellationReason.details,
        reason: loadedTicket.value.cancellationReason.reason,
      },
    });
  }

  if (
    loadedTicket.value?.correctionRequests &&
    Array.isArray(loadedTicket.value.correctionRequests)
  ) {
    loadedTicket.value.correctionRequests.forEach((correctionRequest, index) => {
      specialUpdateEvents.push({
        type: 'specialUpdate' as const,
        subType: 'correction',
        createdAt: correctionRequest.createdAt,
        data: {
          id: `correction-${loadedTicket.value!.id}-${index}`,
          content: correctionRequest.details,
          reason: correctionRequest.reason,
        },
      });
    });
  }

  return [...commentEvents, ...updateEvents, ...specialUpdateEvents].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
});

// Helper computed to get status from ticketStatus.key or fallback to status (for backward compatibility)
const ticketStatus = computed(() => {
  return loadedTicket.value?.ticketStatus?.key || loadedTicket.value?.status || '';
});

const isTargetUser = computed(() => userStore.user?.id === loadedTicket.value?.currentTargetUserId);
const isRequester = computed(() => userStore.user?.id === loadedTicket.value?.requester.id);
const isReviewer = computed(() => userStore.user?.id === loadedTicket.value?.reviewer?.id);

const isMyComment = (userId: number) => {
  return userStore.user?.id === userId;
};

const sortedTargetUsers = computed(() => {
  if (!loadedTicket.value?.targetUsers) return [];

  return [...loadedTicket.value.targetUsers].sort((a, b) => a.order - b.order);
});

const isLastTargetUser = computed(() => {
  if (!loadedTicket.value?.targetUsers || !isTargetUser.value) return false;

  const sortedTargetUsersList = sortedTargetUsers.value;
  const lastUser = sortedTargetUsersList[sortedTargetUsersList.length - 1];

  return lastUser.userId === loadedTicket.value.currentTargetUserId;
});

const formatTicketUpdateDescription = (ticketUpdate: TicketUpdate) => {
  return `${ticketUpdate.description.replace('user', `${ticketUpdate.performedBy.firstName} ${ticketUpdate.performedBy.lastName}`)}`;
};

const getPriorityIcon = (priority: string) => {
  switch (priority) {
    case 'baixa':
      return 'angles-down';
    case 'media':
      return 'equals';
    case 'alta':
      return 'angles-up';
    default:
      return 'equals';
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case DefaultTicketStatus.Pending:
      return 'clock';
    case DefaultTicketStatus.InProgress:
      return 'spinner';
    case DefaultTicketStatus.AwaitingVerification:
      return 'hourglass-half';
    case DefaultTicketStatus.UnderVerification:
      return 'search';
    case DefaultTicketStatus.Completed:
      return 'check-circle';
    case DefaultTicketStatus.Rejected:
      return 'times-circle';
    case DefaultTicketStatus.Returned:
      return 'exclamation-circle';
    default:
      return 'question-circle';
  }
};

const getEventIcon = (description: string) => {
  if (description.includes('criou')) return 'plus-circle';
  if (description.includes('aceitou')) return 'check-circle';
  if (description.includes('enviou para verificação')) return 'eye';
  if (description.includes('aprovou')) return 'thumbs-up';
  if (description.includes('rejeitou')) return 'thumbs-down';
  if (description.includes('solicitou correção')) return 'undo';
  if (description.includes('cancelou')) return 'ban';
  if (description.includes('iniciou correção')) return 'wrench';
  return 'info-circle';
};

const getSpecialUpdateTitle = (subType: string, event?: SpecialUpdateEvent) => {
  const baseTitle = (() => {
    switch (subType) {
      case 'disapproval':
        return 'Tarefa Reprovada';
      case 'cancellation':
        return 'Tarefa Cancelada';
      case 'correction':
        return 'Solicitação de Correção';
      default:
        return 'Atualização';
    }
  })();

  if (event?.data?.reason) {
    return `${baseTitle} - ${formatSnakeToNaturalCase(event.data.reason)}`;
  }

  return baseTitle;
};

const loadChecklistItems = async () => {
  if (!loadedTicket.value) return;
  try {
    const { data } = await checklistService.getByTicket(loadedTicket.value.id);
    checklistItems.value = data;

    // Show Tarefas section if there are items
    if (data.length > 0) {
      showTarefasSection.value = true;
    }

    // Update the ticket in the store with the new checklistItems so Kanban updates immediately
    if (loadedTicket.value) {
      loadedTicket.value.checklistItems = data;
      ticketsStore.updateTicketInCollections(loadedTicket.value);
    }
  } catch (error) {
    console.error('Error loading checklist items:', error);
  }
};

const scrollToTarefas = async () => {
  showTarefasSection.value = true;
  await nextTick();
  await nextTick(); // Double nextTick to ensure DOM is updated
  if (tarefasSectionRef.value) {
    tarefasSectionRef.value.scrollIntoView({ behavior: 'smooth', block: 'start' });

    setTimeout(async () => {
      if (ticketChecklistRef.value) {
        await ticketChecklistRef.value.startAddItem();
      }
    }, 200);
  }
};

const fetchTicket = async (customId: string) => {
  isLoadingTicket.value = true;
  showTarefasSection.value = false;
  try {
    const ticket = await ticketsStore.fetchTicketDetails(customId);
    loadedTicket.value = ticket;
    hasLoadedTicketOnce.value = true;
    fetchComments();
    fetchTicketUpdates();
    loadChecklistItems();

    // Check if ticket is awaiting verification and user is reviewer
    if (
      userStore.user?.id === ticket.reviewer?.id &&
      (ticket.ticketStatus?.key === DefaultTicketStatus.AwaitingVerification ||
        ticket.status === DefaultTicketStatus.AwaitingVerification) &&
      !confirmationModal.value.isOpen
    ) {
      openConfirmationModal(
        'Iniciar Verificação',
        'Você tem certeza que deseja iniciar a verificação desta tarefa?',
        async () => {
          try {
            await ticketService.updateStatus(ticket.customId, {
              status: DefaultTicketStatus.UnderVerification,
            });
            loadedTicket.value = await ticketsStore.fetchTicketDetails(ticket.customId);
          } catch {
            toast.error('Erro ao iniciar verificação');
          }
        },
        false,
        [],
        'start-verification', // pass context
      );
    }
  } catch (error) {
    console.error('Error fetching ticket:', error);
    toast.error('Erro ao carregar tarefa');
    emit('close');
  } finally {
    isLoadingTicket.value = false;
  }
};

watch(
  () => props.ticketCustomId,
  (newCustomId) => {
    if (newCustomId) {
      hasLoadedTicketOnce.value = false;
      fetchTicket(newCustomId);
    } else {
      loadedTicket.value = null;
      comments.value = [];
      ticketUpdates.value = [];
      hasLoadedTicketOnce.value = false;
    }
  },
  { immediate: true },
);

// Close comment menu when clicking outside
const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement;
  if (!target.closest('.comment-menu-container')) {
    openCommentMenuId.value = null;
  }
};

// Add click outside listener
onMounted(() => {
  document.addEventListener('click', handleClickOutside);
  document.addEventListener('keydown', handleImageViewerKeyboard);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
  document.removeEventListener('keydown', handleImageViewerKeyboard);
  // Ensure body scroll is restored
  document.body.style.overflow = '';
});

const handleImageViewerKeyboard = (event: KeyboardEvent) => {
  if (!selectedImage.value) return;

  if (event.key === 'Escape') {
    closeImageViewer();
  } else if (event.key === 'ArrowLeft' && hasPreviousImage.value) {
    previousImage();
  } else if (event.key === 'ArrowRight' && hasNextImage.value) {
    nextImage();
  }
};

const openFileInput = () => {
  if (fileInput.value) {
    fileInput.value.click();
  }
};

const handleFileChange = async (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (!target || !target.files || !loadedTicket.value) return;

  const files = Array.from(target.files);
  selectedFiles.value = files;

  isUploading.value = true;

  try {
    const uploadedUrls: string[] = [];

    for (const file of files) {
      try {
        const { data } = await awsService.getSignedUrl(file.name);

        await axios.put(data.url, file, {
          headers: {
            'Content-Type': file.type,
          },
        });

        const fileUrl = data.url.split('?')[0];
        uploadedUrls.push(fileUrl);
      } catch (error) {
        console.error('Erro ao fazer upload do arquivo:', file.name, error);
        toast.error(`Erro ao fazer upload do arquivo: ${file.name}`);
        throw error; // Re-throw to stop the process
      }
    }

    if (uploadedUrls.length > 0) {
      const response = await ticketService.addFiles(loadedTicket.value.customId, uploadedUrls);

      if (response && response.data) {
        loadedTicket.value = response.data;
      }

      toast.success('Sucesso');
      refreshSelectedTicket();
    }
  } catch (error) {
    console.error('Erro ao fazer upload:', error);
    toast.error('Erro ao anexar arquivos');
  } finally {
    selectedFiles.value = [];
    isUploading.value = false;

    if (fileInput.value) {
      fileInput.value.value = '';
    }
  }
};

const canEditTicket = computed(() => {
  if (!loadedTicket.value) return false;

  const isUserInvolved =
    userStore.user?.id === loadedTicket.value.requester.id ||
    userStore.user?.id === loadedTicket.value.currentTargetUserId;

  const currentStatus = loadedTicket.value?.ticketStatus?.key || loadedTicket.value?.status || '';
  const isTicketActive =
    currentStatus !== DefaultTicketStatus.Completed &&
    currentStatus !== DefaultTicketStatus.Rejected &&
    currentStatus !== DefaultTicketStatus.Canceled;

  return isUserInvolved && isTicketActive;
});

const refreshSelectedTicket = async () => {
  if (loadedTicket.value?.customId) {
    await fetchTicket(loadedTicket.value.customId);
  } else if (props.ticketCustomId) {
    await fetchTicket(props.ticketCustomId);
  }
};

const startEditingName = () => {
  const currentStatus = loadedTicket.value?.ticketStatus?.key || loadedTicket.value?.status || '';
  if (!isRequester.value || currentStatus !== DefaultTicketStatus.Pending) return;
  isEditingName.value = true;
  editingName.value = loadedTicket.value?.name || '';
  nextTick(() => {
    nameInput.value?.focus();
  });
};

const saveTicketName = async () => {
  if (!editingName.value.trim()) {
    toast.error('O assunto da tarefa não pode estar vazio');
    return;
  }

  try {
    await ticketService.update(loadedTicket.value!.customId, {
      name: editingName.value.trim(),
    });

    isEditingName.value = false;

    if (loadedTicket.value) {
      loadedTicket.value.name = editingName.value.trim();
    }

    toast.success('Assunto da tarefa atualizado com sucesso');
    refreshSelectedTicket();
  } catch {
    toast.error('Erro ao atualizar nome da tarefa');
  }
};

const cancelEditingName = () => {
  isEditingName.value = false;
  editingName.value = loadedTicket.value?.name || '';
};

const startEditingDescription = () => {
  const currentStatus = loadedTicket.value?.ticketStatus?.key || loadedTicket.value?.status || '';
  if (!isRequester.value || currentStatus !== DefaultTicketStatus.Pending) return;
  isEditingDescription.value = true;
  editingDescription.value = loadedTicket.value?.description || '';
  descriptionEditorKey.value += 1;
};

const saveTicketDescription = async () => {
  // Create a temporary div to strip HTML and check if content is actually empty
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = editingDescription.value;
  const textContent = tempDiv.textContent || tempDiv.innerText || '';

  if (!textContent.trim()) {
    toast.error('Descrição da tarefa não pode estar vazia');
    return;
  }

  try {
    const processedDescription = await processRichTextContent(editingDescription.value);

    await ticketService.update(loadedTicket.value!.customId, {
      description: processedDescription,
    });

    isEditingDescription.value = false;

    if (loadedTicket.value) {
      loadedTicket.value.description = processedDescription;
    }
    editingDescription.value = processedDescription;

    refreshSelectedTicket();
  } catch {
    toast.error('Erro ao atualizar descrição da tarefa');
  }
};

const cancelEditingDescription = () => {
  isEditingDescription.value = false;
  editingDescription.value = loadedTicket.value?.description || '';
  descriptionEditorKey.value += 1;
};

const cancelVerificationRequest = async (ticketId: string) => {
  openConfirmationModal(
    'Cancelar Envio para Verificação',
    'Tem certeza que deseja cancelar o envio para verificação?',
    async () => {
      try {
        await ticketService.updateStatus(ticketId, { status: DefaultTicketStatus.InProgress });
        toast.success('Envio para verificação cancelado');

        refreshSelectedTicket();
      } catch {
        toast.error('Erro ao cancelar envio para verificação');
      }
    },
  );
};

const showAddMenu = ref(false);

const selectAttachFile = () => {
  closeAddMenu();
  openFileInput();
};

const closeAddMenu = () => {
  showAddMenu.value = false;
};

const isEditingAssignee = ref(false);
const currentlyEditingUser = ref<number | null>(null);
const assigneeSelection = ref<{ departmentId: number | null; userId: number | null }>({
  departmentId: null,
  userId: null,
});

// Compute excluded department IDs - departments that already have other users assigned
const excludedDepartmentIds = computed(() => {
  if (!loadedTicket.value?.targetUsers || !currentlyEditingUser.value) return [];

  return loadedTicket.value.targetUsers
    .filter((tu) => tu.userId !== currentlyEditingUser.value)
    .map((tu) => tu.user?.departmentId)
    .filter((id): id is number => id !== null && id !== undefined);
});

const startEditingAssignee = (targetUserId?: number) => {
  if (!canEditTicket.value || !isRequester.value) return;

  // Determine which user to edit - either the passed targetUserId or currentTargetUserId
  const userIdToEdit = targetUserId ?? loadedTicket.value?.currentTargetUserId ?? null;
  currentlyEditingUser.value = userIdToEdit;

  // Find the target user to populate the selector
  const targetUser = loadedTicket.value?.targetUsers?.find((tu) => tu.userId === userIdToEdit);

  assigneeSelection.value = {
    departmentId: targetUser?.user?.departmentId || null,
    userId: userIdToEdit,
  };
  isEditingAssignee.value = true;
};

const cancelEditingAssignee = () => {
  isEditingAssignee.value = false;
  currentlyEditingUser.value = null;
  assigneeSelection.value = {
    departmentId: null,
    userId: null,
  };
};

const saveAssigneeChange = async (selection: { department: any; user: any }) => {
  if (!selection.user || !loadedTicket.value) return;

  try {
    // Find the order of the user being edited - order is 1-based in the database
    const editingUser = loadedTicket.value.targetUsers?.find(
      (tu) => tu.userId === currentlyEditingUser.value,
    );
    const order = editingUser?.order || 1;

    await ticketService.updateAssignee(loadedTicket.value.customId, selection.user.id, order);

    await refreshSelectedTicket();
    isEditingAssignee.value = false;
    currentlyEditingUser.value = null;
    toast.success('Responsável alterado com sucesso!');
  } catch (error) {
    console.error('Erro ao alterar responsável:', error);
    toast.error('Erro ao alterar responsável');
  }
};

const isSelfAssigned = computed(
  () =>
    loadedTicket.value &&
    loadedTicket.value.requester.id === loadedTicket.value.currentTargetUserId,
);

const startTicket = async (ticketId: string) => {
  openConfirmationModal(
    'Iniciar Tarefa',
    'Tem certeza que deseja iniciar esta tarefa?',
    async () => {
      try {
        await ticketService.accept(ticketId);
        toast.success('Tarefa iniciada com sucesso');
        refreshSelectedTicket();
      } catch {
        toast.error('Erro ao iniciar a tarefa');
      }
    },
  );
};

const showReviewerModal = ref(false);
const reviewerSelection = ref<string | number>('');
const tenantAdmins = ref<any[]>([]);
const isReviewerModalLoading = ref(false);

const fetchTenantAdmins = async () => {
  try {
    const { data } = await userService.getTenantAdmins();
    tenantAdmins.value = data;
  } catch (err) {
    console.error('Failed to fetch tenant admins:', err);
    tenantAdmins.value = [];
    toast.error('Erro ao buscar revisores. Tente novamente.');
  }
};

const confirmReviewerSelection = async () => {
  if (!reviewerSelection.value || reviewerSelection.value === '' || !loadedTicket.value) {
    toast.error('Selecione um revisor');
    return;
  }
  isReviewerModalLoading.value = true;
  try {
    await ticketService.updateReviewer(
      loadedTicket.value.customId,
      reviewerSelection.value as number,
    );
    showReviewerModal.value = false;
    await ticketService.updateStatus(loadedTicket.value.customId, {
      status: DefaultTicketStatus.AwaitingVerification,
    });
    toast.success('Tarefa enviada para revisão');
    refreshSelectedTicket();
  } catch {
    toast.error('Erro ao definir revisor ou enviar para revisão');
  } finally {
    isReviewerModalLoading.value = false;
  }
};

const showDueDateModal = ref(false);
const dueDateValue = ref<string | null>(null);
const dueDateDate = ref<Date | null>(null);
const isDueDateModalLoading = ref(false);

const disabledWeekendDate = (date: Date): boolean => {
  const dayOfWeek = date.getDay();
  return dayOfWeek === 0 || dayOfWeek === 6;
};

const parseDateTime = (dateString: string): Date | null => {
  if (!dateString) return null;
  try {
    const [datePart, timePart] = dateString.split(' ');
    const [day, month, year] = datePart.split('/');
    const [hours, minutes] = timePart.split(':');
    return new Date(
      parseInt(year),
      parseInt(month) - 1,
      parseInt(day),
      parseInt(hours),
      parseInt(minutes),
    );
  } catch {
    return null;
  }
};

const handleDatePickerChange = (value: any) => {
  if (value) {
    dueDateValue.value = value;
    dueDateDate.value = parseDateTime(value);
  } else {
    dueDateValue.value = null;
    dueDateDate.value = null;
  }
};

const formatDateOnly = (date: string | Date | null | undefined): string => {
  if (!date) return '-';
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  if (Number.isNaN(dateObj.getTime())) return '-';

  const day = dateObj.getDate().toString().padStart(2, '0');
  const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
  const year = dateObj.getFullYear().toString().slice(-2);

  return `${day}/${month}/${year}`;
};

const confirmDueDate = async () => {
  if (!dueDateValue.value || !loadedTicket.value) return;

  isDueDateModalLoading.value = true;
  try {
    // Convert the formatted date string to ISO string for the API
    const dueAtISO = dueDateDate.value ? dueDateDate.value.toISOString() : null;

    if (!dueAtISO) {
      toast.error('Data inválida');
      isDueDateModalLoading.value = false;
      return;
    }

    await ticketService.update(loadedTicket.value.customId, { dueAt: dueAtISO });

    await ticketService.accept(loadedTicket.value.customId);

    toast.success('Tarefa aceita com sucesso');
    showDueDateModal.value = false;
    dueDateValue.value = null;
    dueDateDate.value = null;
    refreshSelectedTicket();
  } catch {
    toast.error('Erro ao definir prazo e aceitar tarefa');
  } finally {
    isDueDateModalLoading.value = false;
  }
};
</script>

<style scoped>
/* Ensure DatePicker takes full width */
:deep(.mx-datepicker) {
  width: 100%;
}

:deep(.mx-input-wrapper) {
  width: 100%;
}

/* Quill Editor specific styles */
:deep(.ql-container) {
  border: none !important;
  border-radius: 0 0 8px 8px !important;
  min-height: 120px;
}

:deep(.ql-toolbar) {
  border: none !important;
  border-bottom: 1px solid #e5e7eb !important;
  border-radius: 8px 8px 0 0 !important;
}

/* Dark mode for Quill Editor */
.dark :deep(.ql-toolbar) {
  border-bottom-color: #4b5563 !important;
  background-color: #374151 !important;
}

.dark :deep(.ql-container) {
  background-color: #374151 !important;
  color: #f3f4f6 !important;
}

:deep(.ql-editor.ql-blank::before) {
  color: #9ca3af;
  font-style: italic;
}

.dark :deep(.ql-editor) {
  color: #f3f4f6 !important;
}

.dark :deep(.ql-editor.ql-blank::before) {
  color: #9ca3af !important;
}

/* Content text styling for description and comments */
:deep(.description-text),
:deep(.comment-text) {
  line-height: 1.6;
}

:deep(.description-text p),
:deep(.comment-text p) {
  margin-bottom: 0.75rem;
}

:deep(.description-text ul),
:deep(.description-text ol),
:deep(.comment-text ul),
:deep(.comment-text ol) {
  margin: 0.75rem 0;
  padding-left: 1.5rem;
}

:deep(.description-text ul li),
:deep(.comment-text ul li) {
  list-style-type: disc;
  margin-bottom: 0.25rem;
}

:deep(.description-text ol li),
:deep(.comment-text ol li) {
  list-style-type: decimal;
  margin-bottom: 0.25rem;
}

:deep(.description-text h1),
:deep(.description-text h2),
:deep(.description-text h3),
:deep(.comment-text h1),
:deep(.comment-text h2),
:deep(.comment-text h3) {
  font-weight: 600;
  margin: 1rem 0 0.5rem 0;
}

:deep(.description-text h1),
:deep(.comment-text h1) {
  font-size: 1.25rem;
}

:deep(.description-text h2),
:deep(.comment-text h2) {
  font-size: 1.125rem;
}

:deep(.description-text h3),
:deep(.comment-text h3) {
  font-size: 1rem;
}

:deep(.description-text strong),
:deep(.comment-text strong) {
  font-weight: 600;
}

:deep(.description-text em),
:deep(.comment-text em) {
  font-style: italic;
}

:deep(.description-text blockquote),
:deep(.comment-text blockquote) {
  border-left: 4px solid #d1d5db;
  padding-left: 1rem;
  margin: 1rem 0;
  font-style: italic;
}

.dark :deep(.description-text blockquote),
.dark :deep(.comment-text blockquote) {
  border-left-color: #6b7280;
}

:deep(.description-text a),
:deep(.comment-text a) {
  color: #2563eb;
}

.dark :deep(.description-text a),
.dark :deep(.comment-text a) {
  color: #60a5fa;
}

/* Editable field styles */
.editable-field {
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 4px;
  transition: background-color 0.2s ease;
}

.editable-field:hover {
  background-color: #f8f9fa;
  box-shadow: 0 0 0 1px #e9ecef;
}

.dark .editable-field:hover {
  background-color: #374151;
  box-shadow: 0 0 0 1px #4b5563;
}

.edit-input {
  width: 100%;
  padding: 0.5rem;
  border: 2px solid #4f46e5;
  border-radius: 4px;
  font-size: 0.9rem;
  font-family: inherit;
  background: white;
  color: #212529;
  outline: none;
  transition: border-color 0.2s ease;
}

.edit-input:focus {
  border-color: #818cf8;
  box-shadow: 0 0 0 3px rgba(129, 140, 248, 0.1);
}

.dark .edit-input {
  background: #374151;
  color: #f9fafb;
  border-color: #818cf8;
}

.dark .edit-input:focus {
  background: #1f2937;
  border-color: #a5b4fc;
}

.content {
  min-width: 900px;
  min-height: 90vh;
  padding: 1.5rem;
}

.full-width-subject {
  margin-bottom: 1rem;
  background: #f8f9fa;
  padding: 0.75rem;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  transition: all 0.3s ease;
}

.ticket-details-container {
  display: grid;
  grid-template-columns: 1.5fr 2fr;
  gap: 1rem;
  margin-bottom: 2rem;
  align-items: start;
}

.left-column {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.right-column {
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.description-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0 0.5rem;
}

.description-box {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 0.75rem;
  flex: 1;
  border: 1px solid #e2e8f0;
}

.description-text {
  white-space: pre-wrap;
  line-height: 1.5;
  min-height: 80px;
  font-size: 0.9rem;
  color: #212529;
}

.description-text :deep(p) {
  margin: 0 0 0.5rem 0;
}

.description-text :deep(p:last-child) {
  margin-bottom: 0;
}

.description-text :deep(strong) {
  font-weight: 600;
}

.description-text :deep(em) {
  font-style: italic;
}

.description-text :deep(u) {
  text-decoration: underline;
}

.description-text :deep(h1) {
  font-size: 2em;
  font-weight: 700;
  margin: 1rem 0 0.5rem 0;
  color: #1a202c;
}

.description-text :deep(h2) {
  font-size: 1.5em;
  font-weight: 600;
  margin: 0.8rem 0 0.4rem 0;
  color: #1a202c;
}

.description-text :deep(h3) {
  font-size: 1.25em;
  font-weight: 600;
  margin: 0.6rem 0 0.3rem 0;
  color: #1a202c;
}

.description-text :deep(h4) {
  font-size: 1.1em;
  font-weight: 600;
  margin: 0.5rem 0 0.25rem 0;
  color: #1a202c;
}

.description-text :deep(h5) {
  font-size: 1em;
  font-weight: 600;
  margin: 0.4rem 0 0.2rem 0;
  color: #1a202c;
}

.description-text :deep(h6) {
  font-size: 0.9em;
  font-weight: 600;
  margin: 0.3rem 0 0.15rem 0;
  color: #1a202c;
}

.description-text :deep(.ql-size-small) {
  font-size: 0.75em;
}

.description-text :deep(.ql-size-large) {
  font-size: 1.5em;
}

.description-text :deep(.ql-size-huge) {
  font-size: 2.5em;
}

.description-text :deep(.ql-syntax) {
  background: #f8f9fa;
  color: #212529;
  padding: 1rem;
  border-radius: 4px;
  font-family: 'Courier New', monospace;
  border: 1px solid #e9ecef;
  margin: 0.5rem 0;
  overflow-x: auto;
}

.description-text :deep(ol),
.description-text :deep(ul) {
  margin: 0.5rem 0;
  padding-left: 1.5rem;
}

.description-text :deep(ol) {
  list-style-type: decimal;
}

.description-text :deep(ul) {
  list-style-type: disc;
}

.description-text :deep(ol ol),
.description-text :deep(ul ul) {
  list-style-type: circle;
}

.description-text :deep(ol ol ol),
.description-text :deep(ul ul ul) {
  list-style-type: square;
}

.description-text :deep(li) {
  margin-bottom: 0.25rem;
}

.description-text :deep(.ql-indent-1) {
  padding-left: 3em;
}

.description-text :deep(.ql-indent-2) {
  padding-left: 6em;
}

.description-text :deep(.ql-indent-3) {
  padding-left: 9em;
}

.description-text :deep(.ql-indent-4) {
  padding-left: 12em;
}

.description-text :deep(.ql-indent-5) {
  padding-left: 15em;
}

.description-text :deep(.ql-indent-6) {
  padding-left: 18em;
}

.description-text :deep(.ql-indent-7) {
  padding-left: 21em;
}

.description-text :deep(.ql-indent-8) {
  padding-left: 24em;
}

.description-text :deep(.ql-align-center) {
  text-align: center;
}

.description-text :deep(.ql-align-right) {
  text-align: right;
}

.description-text :deep(.ql-align-justify) {
  text-align: justify;
}

.description-text :deep(.ql-direction-rtl) {
  direction: rtl;
  text-align: right;
}

.description-text :deep(blockquote) {
  margin: 0.5rem 0;
  padding: 0.5rem 1rem;
  border-left: 4px solid #e9ecef;
  background: #f8f9fa;
  font-style: italic;
}

.description-text :deep(code) {
  background: #f8f9fa;
  padding: 0.125rem 0.25rem;
  border-radius: 3px;
  font-family: 'Courier New', monospace;
  font-size: 0.875em;
}

.description-text :deep(pre) {
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 4px;
  overflow-x: auto;
  margin: 0.5rem 0;
}

.description-text :deep(a) {
  color: #4f46e5;
  text-decoration: none;
}

.description-text :deep(a:hover) {
  text-decoration: underline;
}

/* Checkbox lists styling */
.description-text :deep(ul[data-checked]) {
  list-style: none;
  padding-left: 0;
}

.description-text :deep(ul[data-checked] li) {
  position: relative;
  padding-left: 2rem;
  margin-bottom: 0.5rem;
}

.description-text :deep(ul[data-checked='false'] li::before) {
  content: '☐';
  position: absolute;
  left: 0;
  top: 0;
  font-size: 1.2em;
  color: #6c757d;
}

.description-text :deep(ul[data-checked='true'] li::before) {
  content: '☑';
  position: absolute;
  left: 0;
  top: 0;
  font-size: 1.2em;
  color: #28a745;
}

.description-text :deep(ul[data-checked='true'] li) {
  text-decoration: line-through;
  color: #6c757d;
}

/* Image styling */
.description-text :deep(img) {
  max-width: 100%;
  height: auto;
  border-radius: 4px;
  margin: 0.5rem 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.details-item {
  background: #f8f9fa;
  padding: 0.75rem;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  transition: all 0.3s ease;
  margin-bottom: 0.5rem;
  border: 1px solid #e2e8f0;
}

.details-item:hover {
  background: #f0f2f5;
  transform: translateY(-2px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border-color: #cbd5e1;
}

.detail-icon {
  width: 2rem;
  height: 2rem;
  min-width: 2rem;
  background: #e9ecef;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #495057;
  font-size: 0.9rem;
}

.detail-content {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.detail-label {
  font-size: 0.75rem;
  color: #6c757d;
  min-width: 85px;
}

.detail-value {
  font-size: 0.9rem;
  color: #212529;
  flex: 1;
}

.priority-label,
.status-label {
  display: inline-flex;
  align-items: center;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.85rem;
  font-weight: 500;
  gap: 0.5rem;
}

.badge-icon {
  font-size: 0.9rem;
}

.priority-label.priority-baixa {
  background: #e8f5e9;
  color: #2e7d32;
}

.priority-label.priority-media {
  background: #fff3e0;
  color: #f57c00;
}

.priority-label.priority-alta {
  background: #ffebee;
  color: #c62828;
}

.status-label.status-pendente {
  background-color: #fff3e0;
  color: #f57c00;
  border: 1px solid rgba(245, 124, 0, 0.3);
}

.status-label.status-em-andamento {
  background-color: #e3f2fd;
  color: #1976d2;
  border: 1px solid rgba(25, 118, 210, 0.3);
}

.status-label.status-aguardando-verificacao {
  background-color: #f3e5f5;
  color: #7b1fa2;
  border: 1px solid rgba(123, 31, 162, 0.3);
}

.status-label.status-em-verificacao {
  background-color: #e9d5ff;
  color: #7e22ce;
  border: 1px solid rgba(126, 34, 206, 0.3);
}

.status-label.status-finalizado {
  background-color: #e8f5e9;
  color: #2e7d32;
  border: 1px solid rgba(46, 125, 50, 0.3);
}

.status-label.status-cancelado {
  background-color: #ffebee;
  color: #c62828;
  border: 1px solid rgba(198, 40, 40, 0.3);
}

.status-label.status-devolvido {
  background-color: #fff3e0;
  color: #f57c00;
  border: 1px solid rgba(245, 124, 0, 0.3);
}

.ticket-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e9ecef;
}

.action-button {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  color: white;
}

.action-button.accept {
  background-color: #16a34a;
}

.action-button.accept:hover {
  background-color: #15803d;
}

.action-button.verify {
  background-color: #0284c7;
}

.action-button.verify:hover {
  background-color: #0369a1;
}

.action-button.approve {
  background-color: #059669;
}

.action-button.approve:hover {
  background-color: #047857;
}

.action-button.request-correction {
  background-color: #7b1fa2;
}

.action-button.request-correction:hover {
  background-color: #6a1b9a;
}

.action-button.correct {
  background-color: #ff5722;
}

.action-button.correct:hover {
  background-color: #e64a19;
}

.action-button.reject {
  background-color: #dc2626;
}

.action-button.reject:hover {
  background-color: #b91c1c;
}

.action-button.cancel {
  background-color: #dc2626;
}

.action-button.cancel:hover {
  background-color: #b91c1c;
}

.action-button.approve {
  background-color: #059669;
  color: white;
}

.action-button.approve:hover {
  background-color: #047857;
}

.action-button.request-correction {
  background-color: #7b1fa2;
  color: white;
}

.action-button.request-correction:hover {
  background-color: #6a1b9a;
}

.action-button.reject {
  background-color: #dc2626;
  color: white;
}

.action-button.reject:hover {
  background-color: #b91c1c;
}

.status-waiting {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: #7e22ce;
}

.waiting-icon {
  color: #7e22ce;
}

.comment-section {
  margin-top: 2rem;
  background: #f8f9fa;
  border-radius: 8px;
  padding: 1.5rem;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
  color: #495057;
}

.section-header h3 {
  margin: 0;
  font-size: 1.1rem;
}

.comment-input {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.quill-wrapper {
  background: white;
  border-radius: 8px;
  border: 1px solid #e9ecef;
  overflow: hidden;
}

.quill-wrapper :deep(.ql-toolbar) {
  border: none;
  border-bottom: 1px solid #e9ecef;
  background: #f8f9fa;
}

.quill-wrapper :deep(.ql-container) {
  border: none;
  font-family: inherit;
  font-size: 14px;
}

.quill-wrapper :deep(.ql-editor) {
  min-height: 100px;
  padding: 1rem;
  line-height: 1.5;
}

.quill-wrapper :deep(.ql-editor.ql-blank::before) {
  font-style: normal;
  color: #6c757d;
}

.update-input {
  width: 100%;
  min-height: 100px;
  padding: 1rem;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  resize: vertical;
  font-family: inherit;
  line-height: 1.5;
  background: white;
  transition: all 0.3s ease;
}

.update-input:focus {
  outline: none;
  border-color: #4f46e5;
  box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.1);
}

.event-list {
  margin-top: 1.5rem;
  position: relative;
}

.event-list::before {
  content: '';
  position: absolute;
  left: 1.25rem;
  top: 0;
  bottom: 0;
  width: 2px;
  background: #e2e8f0;
  z-index: 0;
}

.event-item {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  background: white;
  border-radius: 8px;
  margin-bottom: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  position: relative;
  z-index: 1;
}

.event-item.system-event {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  padding: 0.75rem;
}

.event-item.system-event .comment-avatar {
  background: #e2e8f0;
  width: 2rem;
  height: 2rem;
  font-size: 1.2rem;
}

.event-item.system-event .update-content {
  font-size: 0.9rem;
  color: #64748b;
}

.comment-avatar {
  width: 2.5rem;
  height: 2.5rem;
  background: #e9ecef;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #495057;
  font-size: 1.5rem;
  border: 2px solid white;
  z-index: 2;
}

.comment-content {
  flex: 1;
}

.comment-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.update-description-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.update-content {
  width: 100%;
  display: flex;
}

.comment-author {
  font-weight: 500;
  color: #212529;
}

.comment-time {
  font-size: 0.8rem;
  color: #6c757d;
}

.comment-text {
  color: #495057;
  line-height: 1.5;
  word-break: break-word;
  overflow-wrap: anywhere;
  max-width: 100%;
}

.comment-text :deep(p) {
  margin: 0 0 0.5rem 0;
}

.comment-text :deep(p:last-child) {
  margin-bottom: 0;
}

.comment-text :deep(strong) {
  font-weight: 600;
}

.comment-text :deep(em) {
  font-style: italic;
}

.comment-text :deep(u) {
  text-decoration: underline;
}

.comment-text :deep(ol),
.comment-text :deep(ul) {
  margin: 0.5rem 0;
  padding-left: 1.5rem;
}

.comment-text :deep(li) {
  margin-bottom: 0.25rem;
}

.comment-text :deep(blockquote) {
  margin: 0.5rem 0;
  padding: 0.5rem 1rem;
  border-left: 4px solid #e9ecef;
  background: #f8f9fa;
  font-style: italic;
}

.comment-text :deep(code) {
  background: #f8f9fa;
  padding: 0.125rem 0.25rem;
  border-radius: 3px;
  font-family: 'Courier New', monospace;
  font-size: 0.875em;
}

.comment-text :deep(pre) {
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 4px;
  overflow-x: auto;
  margin: 0.5rem 0;
}

.comment-text :deep(a) {
  color: #4f46e5;
  text-decoration: none;
  word-break: break-all;
  overflow-wrap: anywhere;
}

.comment-text :deep(a:hover) {
  text-decoration: underline;
}

/* Checkbox lists styling */
.comment-text :deep(ul[data-checked]) {
  list-style: none;
  padding-left: 0;
}

.comment-text :deep(ul[data-checked] li) {
  position: relative;
  padding-left: 2rem;
  margin-bottom: 0.5rem;
}

.comment-text :deep(ul[data-checked='false'] li::before) {
  content: '☐';
  position: absolute;
  left: 0;
  top: 0;
  font-size: 1.2em;
  color: #6c757d;
}

.comment-text :deep(ul[data-checked='true'] li::before) {
  content: '☑';
  position: absolute;
  left: 0;
  top: 0;
  font-size: 1.2em;
  color: #28a745;
}

.comment-text :deep(ul[data-checked='true'] li) {
  text-decoration: line-through;
  color: #6c757d;
}

/* Image styling */
.comment-text :deep(img) {
  max-width: 100%;
  height: auto;
  border-radius: 4px;
  margin: 0.5rem 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.deadline-danger {
  background: #fff3f3 important;
}

.deadline-danger .detail-value {
  color: #dc3545 important;
  font-weight: bold important;
}

.deadline-normal {
  background: #f0fff4 important;
}

.deadline-normal .detail-value {
  color: #28a745 important;
}

/* Dark mode deadline styles */
:deep(body.dark-mode) .deadline-danger {
  background: #2d1b1b !important;
  border-color: #dc3545 !important;
}

:deep(body.dark-mode) .deadline-danger .detail-value {
  color: #ef5350 !important;
  font-weight: bold !important;
}

:deep(body.dark-mode) .deadline-normal {
  background: #1a2e1a !important;
  border-color: #28a745 !important;
}

:deep(body.dark-mode) .deadline-normal .detail-value {
  color: #4ade80 !important;
}

.warning-icon {
  color: #dc3545;
  margin-left: 0.5rem;
}

.comment-disabled {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: 1.5rem;
  background: #ffebee;
  border-radius: 8px;
  color: #c62828;
}

.comment-disabled svg {
  font-size: 1.2rem;
}

.comment-disabled p {
  margin: 0;
  font-size: 0.9rem;
}

.files-container {
  display: flex;
  gap: 10px;
}

.files-section-title {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}

.files-label {
  font-size: 16px;
  font-weight: 500;
}

.files-count {
  margin-left: 8px;
  margin-top: 2px;
  width: 22px;
  height: 20px;
  background-color: #f8f9fa;
  border-radius: 50%;
  font-size: 10px;
  border: 1px solid #e2e8f0;
  display: flex;
  justify-content: center;
  align-items: center;
}

.file-item {
  width: 110px;
  height: 90px;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
}

.file-item:hover {
  cursor: pointer;
}

.file-preview {
  width: 100%;
  height: 70%;
  padding: 0 2px;
  background-color: #f8f9fa;
  border-radius: 6px 6px 0 0;
  display: flex;
  justify-content: center;
  align-items: center;
}

.file-name-container {
  width: 100%;
  height: 30%;
  font-size: 12px;
  display: flex;
  align-items: center;
  background-color: white;
  padding: 0 4px;
  border-radius: 0 0 10px 10px;
}

.file-name {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  direction: rtl;
}

/* Dark mode */
:deep(body.dark-mode) .details-item {
  background: #1a2233;
  border-color: #2d3748;
}

:deep(body.dark-mode) .details-item:hover {
  background: #1e293b;
  border-color: #374151;
}

:deep(body.dark-mode) .detail-icon {
  background: #2d3748;
  color: #94a3b8;
}

:deep(body.dark-mode) .detail-label {
  color: #94a3b8;
}

:deep(body.dark-mode) .detail-value {
  color: #e2e8f0;
}

:deep(body.dark-mode) .comment-section {
  background: #1f2937;
}

:deep(body.dark-mode) .event-item {
  background: #1e293b;
}

:deep(body.dark-mode) .event-item.system-event {
  background: #1a2233;
  border-color: #2d3748;
}

:deep(body.dark-mode) .event-item.system-event .comment-avatar {
  background: #2d3748;
  color: #94a3b8;
}

:deep(body.dark-mode) .event-item.system-event .update-content {
  color: #94a3b8;
}

:deep(body.dark-mode) .comment-avatar {
  background: #2d3748;
  color: #94a3b8;
}

:deep(body.dark-mode) .comment-author {
  color: #e2e8f0;
}

:deep(body.dark-mode) .comment-text {
  color: #e5e7eb;
}

:deep(body.dark-mode) .update-input {
  background: #374151;
  border-color: #4b5563;
  color: #f9fafb;
}

:deep(body.dark-mode) .update-input:focus {
  border-color: #818cf8;
  box-shadow: 0 0 0 2px rgba(129, 140, 248, 0.1);
}

:deep(body.dark-mode) .comment-disabled {
  background: #1a1a1a;
  color: #ef5350;
}

.verification-actions {
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
}

:deep(body.dark-mode) .event-list::before {
  background: #2d3748;
}

:deep(body.dark-mode) .comment-avatar {
  border-color: #1e293b;
}

:deep(body.dark-mode) .event-item.system-event .comment-avatar {
  border-color: #1a2233;
}

.system-avatar {
  background: #e2e8f0 !important;
  color: #475569 !important;
}

:deep(body.dark-mode) .system-avatar {
  background: #334155 !important;
  color: #94a3b8 !important;
}

.special-update {
  border-left: 3px solid #f59e0b;
  background: #fffbeb !important;
}

.special-update .comment-text {
  font-style: italic;
  padding: 0.5rem;
  background: rgba(245, 158, 11, 0.05);
  border-radius: 0.375rem;
}

.special-avatar {
  background: #fef3c7 !important;
  color: #b45309 !important;
}

.user-initials {
  font-size: 1rem;
  font-weight: 600;
}

/* Disapproval - Red styling */
.special-update.disapproval {
  border-left: 3px solid #ef4444;
  background: #fee2e2 !important;
}

.special-update.disapproval .comment-text {
  background: rgba(239, 68, 68, 0.05);
}

.special-avatar.disapproval {
  background: #fecaca !important;
  color: #b91c1c !important;
}

.special-title.disapproval {
  color: #b91c1c;
}

/* Cancellation - Gray styling */
.special-update.cancellation {
  border-left: 3px solid #6b7280;
  background: #f3f4f6 !important;
}

.special-update.cancellation .comment-text {
  background: rgba(107, 114, 128, 0.05);
}

.special-avatar.cancellation {
  background: #e5e7eb !important;
  color: #4b5563 !important;
}

.special-title.cancellation {
  color: #4b5563;
}

/* Correction - Purple styling */
.special-update.correction {
  border-left: 3px solid #8b5cf6;
  background: #f5f3ff !important;
}

.special-update.correction .comment-text {
  background: rgba(139, 92, 246, 0.05);
}

.special-avatar.correction {
  background: #ede9fe !important;
  color: #6d28d9 !important;
}

.special-title.correction {
  color: #6d28d9;
}

:deep(body.dark-mode) .special-update {
  background: #292524 !important;
  border-left: 3px solid #d97706;
}

:deep(body.dark-mode) .special-update .comment-text {
  background: rgba(217, 119, 6, 0.1);
}

:deep(body.dark-mode) .special-avatar {
  background: #422006 !important;
  color: #f59e0b !important;
}

/* Dark mode disapproval */
:deep(body.dark-mode) .special-update.disapproval {
  background: #1c1917 !important;
  border-left: 3px solid #dc2626;
}

:deep(body.dark-mode) .special-update.disapproval .comment-text {
  background: rgba(220, 38, 38, 0.1);
}

:deep(body.dark-mode) .special-avatar.disapproval {
  background: #3f0f0f !important;
  color: #ef4444 !important;
}

/* Dark mode cancellation */
:deep(body.dark-mode) .special-update.cancellation {
  background: #1a1d23 !important;
  border-left: 3px solid #9ca3af;
}

:deep(body.dark-mode) .special-update.cancellation .comment-text {
  background: rgba(156, 163, 175, 0.1);
}

:deep(body.dark-mode) .special-avatar.cancellation {
  background: #272a35 !important;
  color: #d1d5db !important;
}

/* Dark mode correction */
:deep(body.dark-mode) .special-update.correction {
  background: #1e1b4b !important;
  border-left: 3px solid #8b5cf6;
}

:deep(body.dark-mode) .special-update.correction .comment-text {
  background: rgba(139, 92, 246, 0.1);
}

:deep(body.dark-mode) .special-avatar.correction {
  background: #2e1065 !important;
  color: #a78bfa !important;
}

.add-file-button {
  width: 26px;
  height: 24px;
  margin-left: 18px;
  padding: 0;
}

.add-file-button:hover {
  background-color: #e2e3e7;
}

.hidden {
  display: none;
}

.file-item.pending {
  position: relative;
  border: 1px dashed #0284c7;
  background-color: rgba(2, 132, 199, 0.05);
}

.file-item.pending .file-preview {
  color: #0284c7;
}

.file-uploading {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.5rem;
  color: #0284c7;
  border-radius: 6px;
}

.upload-actions {
  display: none;
}

:deep(body.dark-mode) .quill-wrapper {
  background: #374151;
  border-color: #4b5563;
}

:deep(body.dark-mode) .quill-wrapper .ql-toolbar {
  background: #1f2937;
  border-bottom-color: #4b5563;
}

:deep(body.dark-mode) .quill-wrapper .ql-editor {
  background: #374151;
  color: #f9fafb;
}

:deep(body.dark-mode) .quill-wrapper .ql-editor.ql-blank::before {
  color: #9ca3af;
}

:deep(body.dark-mode) .comment-text {
  color: #e5e7eb;
}

:deep(body.dark-mode) .comment-text blockquote {
  border-left-color: #4b5563;
  background: #1f2937;
}

:deep(body.dark-mode) .comment-text code {
  background: #1f2937;
  color: #e5e7eb;
}

:deep(body.dark-mode) .comment-text pre {
  background: #1f2937;
  color: #e5e7eb;
}

:deep(body.dark-mode) .comment-text a {
  color: #60a5fa;
}

/* Dark mode Quill-specific styling */
:deep(body.dark-mode) .comment-text h1,
:deep(body.dark-mode) .comment-text h2,
:deep(body.dark-mode) .comment-text h3,
:deep(body.dark-mode) .comment-text h4,
:deep(body.dark-mode) .comment-text h5,
:deep(body.dark-mode) .comment-text h6 {
  color: #f9fafb;
}

:deep(body.dark-mode) .comment-text .ql-syntax {
  background: #1f2937;
  color: #e5e7eb;
  border: 1px solid #374151;
}

:deep(body.dark-mode) .comment-text .ql-size-small,
:deep(body.dark-mode) .comment-text .ql-size-large,
:deep(body.dark-mode) .comment-text .ql-size-huge {
  color: #e5e7eb;
}

/* Quill-specific styling for comment display */
.comment-text :deep(.ql-size-small) {
  font-size: 0.75em;
}

.comment-text :deep(.ql-size-large) {
  font-size: 1.5em;
}

.comment-text :deep(.ql-size-huge) {
  font-size: 2.5em;
}

.comment-text :deep(h1) {
  font-size: 2em;
  font-weight: bold;
  margin: 0.67em 0;
  line-height: 1.2;
}

.comment-text :deep(h2) {
  font-size: 1.5em;
  font-weight: bold;
  margin: 0.83em 0;
  line-height: 1.2;
}

.comment-text :deep(h3) {
  font-size: 1.17em;
  font-weight: bold;
  margin: 1em 0;
  line-height: 1.2;
}

.comment-text :deep(h4) {
  font-size: 1em;
  font-weight: bold;
  margin: 1.33em 0;
  line-height: 1.2;
}

.comment-text :deep(h5) {
  font-size: 0.83em;
  font-weight: bold;
  margin: 1.67em 0;
  line-height: 1.2;
}

.comment-text :deep(h6) {
  font-size: 0.67em;
  font-weight: bold;
  margin: 2.33em 0;
  line-height: 1.2;
}

.comment-text :deep(.ql-syntax) {
  background: #23241f;
  color: #f8f8f2;
  overflow: visible;
  white-space: pre-wrap;
  margin: 0.5rem 0;
  padding: 1rem;
  border-radius: 4px;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 0.875em;
  line-height: 1.4;
}

.comment-text :deep(.ql-code-block-container) {
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
}

.comment-text :deep(.ql-indent-1) {
  padding-left: 3em;
}

.comment-text :deep(.ql-indent-2) {
  padding-left: 6em;
}

.comment-text :deep(.ql-indent-3) {
  padding-left: 9em;
}

.comment-text :deep(.ql-indent-4) {
  padding-left: 12em;
}

.comment-text :deep(.ql-indent-5) {
  padding-left: 15em;
}

.comment-text :deep(.ql-indent-6) {
  padding-left: 18em;
}

.comment-text :deep(.ql-indent-7) {
  padding-left: 21em;
}

.comment-text :deep(.ql-indent-8) {
  padding-left: 24em;
}

.comment-text :deep(.ql-align-center) {
  text-align: center;
}

.comment-text :deep(.ql-align-right) {
  text-align: right;
}

.comment-text :deep(.ql-align-justify) {
  text-align: justify;
}

.comment-text :deep(.ql-direction-rtl) {
  direction: rtl;
  text-align: inherit;
}

/* Enhanced list styling */
.comment-text :deep(ol) {
  counter-reset: list-1 list-2 list-3 list-4 list-5 list-6 list-7 list-8 list-9;
  padding-left: 1.5rem;
}

.comment-text :deep(ul) {
  padding-left: 1.5rem;
}

.comment-text :deep(ol > li) {
  counter-increment: list-1;
  list-style-type: none;
  position: relative;
}

.comment-text :deep(ol > li::before) {
  content: counter(list-1, decimal) '. ';
  position: absolute;
  left: -1.5rem;
  font-weight: normal;
}

.comment-text :deep(ul > li) {
  list-style-type: disc;
  position: relative;
}

.comment-text :deep(ul ul > li) {
  list-style-type: circle;
}

.comment-text :deep(ul ul ul > li) {
  list-style-type: square;
}

/* Nested list indentation */
.comment-text :deep(li.ql-indent-1) {
  padding-left: 3em;
}

.comment-text :deep(li.ql-indent-2) {
  padding-left: 6em;
}

.comment-text :deep(li.ql-indent-3) {
  padding-left: 9em;
}

/* Better spacing for nested elements */
.comment-text :deep(p + h1),
.comment-text :deep(p + h2),
.comment-text :deep(p + h3),
.comment-text :deep(p + h4),
.comment-text :deep(p + h5),
.comment-text :deep(p + h6) {
  margin-top: 1em;
}

.comment-text :deep(h1 + p),
.comment-text :deep(h2 + p),
.comment-text :deep(h3 + p),
.comment-text :deep(h4 + p),
.comment-text :deep(h5 + p),
.comment-text :deep(h6 + p) {
  margin-top: 0.5em;
}

:deep(body.dark-mode) .description-box {
  background: #1a2233;
  border-color: #2d3748;
}

:deep(body.dark-mode) .description-text {
  color: #e5e7eb;
}

:deep(body.dark-mode) .description-text :deep(h1),
:deep(body.dark-mode) .description-text :deep(h2),
:deep(body.dark-mode) .description-text :deep(h3),
:deep(body.dark-mode) .description-text :deep(h4),
:deep(body.dark-mode) .description-text :deep(h5),
:deep(body.dark-mode) .description-text :deep(h6) {
  color: #f9fafb;
}

:deep(body.dark-mode) .description-text :deep(blockquote) {
  border-left-color: #4b5563;
  background: #1f2937;
}

:deep(body.dark-mode) .description-text :deep(code) {
  background: #1f2937;
  color: #e5e7eb;
}

:deep(body.dark-mode) .description-text :deep(pre) {
  background: #1f2937;
  color: #e5e7eb;
}

:deep(body.dark-mode) .description-text :deep(.ql-syntax) {
  background: #1f2937;
  color: #e5e7eb;
  border-color: #374151;
}

:deep(body.dark-mode) .description-text :deep(.ql-size-small),
:deep(body.dark-mode) .description-text :deep(.ql-size-large),
:deep(body.dark-mode) .description-text :deep(.ql-size-huge) {
  color: #e5e7eb;
}

:deep(body.dark-mode) .description-text :deep(a) {
  color: #60a5fa;
}

/* Dark mode checkbox styling */
:deep(body.dark-mode) .description-text :deep(ul[data-checked='false'] li::before) {
  color: #9ca3af;
}

:deep(body.dark-mode) .description-text :deep(ul[data-checked='true'] li::before) {
  color: #10b981;
}

:deep(body.dark-mode) .description-text :deep(ul[data-checked='true'] li) {
  color: #9ca3af;
}

/* Dark mode image styling */
:deep(body.dark-mode) .description-text :deep(img) {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

:deep(body.dark-mode) .comment-text :deep(a) {
  color: #60a5fa;
}

/* Dark mode checkbox styling */
:deep(body.dark-mode) .comment-text :deep(ul[data-checked='false'] li::before) {
  color: #9ca3af;
}

:deep(body.dark-mode) .comment-text :deep(ul[data-checked='true'] li::before) {
  color: #10b981;
}

:deep(body.dark-mode) .comment-text :deep(ul[data-checked='true'] li) {
  color: #9ca3af;
}

:deep(body.dark-mode) .comment-text :deep(img) {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

:deep(body.dark-mode) .comment-text :deep(img) {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.editable-field {
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 4px;
  transition: background-color 0.2s ease;
}

.editable-field:hover {
  background-color: #f8f9fa;
  box-shadow: 0 0 0 1px #e9ecef;
}

.editing-container {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

/* Edit input styling */
.edit-input {
  width: 100%;
  padding: 0.5rem;
  border: 2px solid #4f46e5;
  border-radius: 4px;
  font-size: 0.9rem;
  font-family: inherit;
  background: white;
  color: #212529;
  outline: none;
  transition: border-color 0.2s ease;
}

.edit-input:focus {
  border-color: #818cf8;
  box-shadow: 0 0 0 3px rgba(129, 140, 248, 0.1);
}

.edit-buttons {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-save {
  background: #10b981;
  color: white;
}

.btn-save:hover {
  background: #059669;
  transform: translateY(-1px);
}

.btn-cancel {
  background: #6b7280;
  color: white;
}

.btn-cancel:hover {
  background: #4b5563;
  transform: translateY(-1px);
}

/* Dark mode editing styles */
:deep(body.dark-mode) .editable-field:hover {
  background-color: #374151;
  box-shadow: 0 0 0 1px #4b5563;
}

:deep(body.dark-mode) .edit-input {
  background: #374151;
  color: #f9fafb;
  border-color: #818cf8;
}

:deep(body.dark-mode) .edit-input:focus {
  background: #1f2937;
  border-color: #a5b4fc;
}

:deep(body.dark-mode) .btn-save {
  background: #059669;
}

:deep(body.dark-mode) .btn-save:hover {
  background: #047857;
}

:deep(body.dark-mode) .btn-cancel {
  background: #4b5563;
}

:deep(body.dark-mode) .btn-cancel:hover {
  background: #374151;
}

.action-button.cancel {
  background-color: #dc2626;
}

.action-button.cancel:hover {
  background-color: #b91c1c;
}

.action-button.cancel-verification {
  background-color: #f59e0b;
}

.action-button.cancel-verification:hover {
  background-color: #d97706;
}

.target-user-container {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.inactive-user-indicator {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  margin-top: 0.25rem;
}

.inactive-user-indicator .text-orange-500 {
  color: #f97316;
}

.inactive-user-indicator .text-sm {
  font-size: 0.875rem;
}

.inactive-user-indicator .font-medium {
  font-weight: 500;
}

/* Dark mode styles for inactive user indicator */
:deep(body.dark-mode) .inactive-user-indicator .text-orange-500 {
  color: #fb923c;
}

:deep(body.dark-mode) .description-text {
  color: #e5e7eb;
}

/* Add comprehensive dark mode styles for v-html content */
:deep(body.dark-mode) .description-text :deep(p),
:deep(body.dark-mode) .description-text :deep(div),
:deep(body.dark-mode) .description-text :deep(span) {
  color: #e5e7eb !important;
}

:deep(body.dark-mode) .description-text :deep(h1),
:deep(body.dark-mode) .description-text :deep(h2),
:deep(body.dark-mode) .description-text :deep(h3),
:deep(body.dark-mode) .description-text :deep(h4),
:deep(body.dark-mode) .description-text :deep(h5),
:deep(body.dark-mode) .description-text :deep(h6) {
  color: #f9fafb;
}

:deep(body.dark-mode) .description-text :deep(blockquote) {
  border-left-color: #4b5563;
  background: #1f2937;
}

:deep(body.dark-mode) .description-text :deep(code) {
  background: #1f2937;
  color: #e5e7eb;
}

:deep(body.dark-mode) .description-text :deep(pre) {
  background: #1f2937;
  color: #e5e7eb;
}

:deep(body.dark-mode) .description-text :deep(.ql-syntax) {
  background: #1f2937;
  color: #e5e7eb;
  border-color: #374151;
}

:deep(body.dark-mode) .description-text :deep(.ql-size-small),
:deep(body.dark-mode) .description-text :deep(.ql-size-large),
:deep(body.dark-mode) .description-text :deep(.ql-size-huge) {
  color: #e5e7eb;
}

:deep(body.dark-mode) .description-text :deep(a) {
  color: #60a5fa;
}

/* Dark mode checkbox styling */
:deep(body.dark-mode) .description-text :deep(ul[data-checked='false'] li::before) {
  color: #9ca3af;
}

:deep(body.dark-mode) .description-text :deep(ul[data-checked='true'] li::before) {
  color: #10b981;
}

:deep(body.dark-mode) .description-text :deep(ul[data-checked='true'] li) {
  color: #9ca3af;
}

/* Dark mode image styling */
:deep(body.dark-mode) .description-text :deep(img) {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

:deep(body.dark-mode) .comment-text :deep(a) {
  color: #60a5fa;
}

/* Dark mode checkbox styling */
:deep(body.dark-mode) .comment-text :deep(ul[data-checked='false'] li::before) {
  color: #9ca3af;
}

:deep(body.dark-mode) .comment-text :deep(ul[data-checked='true'] li::before) {
  color: #10b981;
}

:deep(body.dark-mode) .comment-text :deep(ul[data-checked='true'] li) {
  color: #9ca3af;
}

:deep(body.dark-mode) .comment-text :deep(img) {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

:deep(body.dark-mode) .comment-text :deep(img) {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.editable-field {
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 4px;
  transition: background-color 0.2s ease;
}

.editable-field:hover {
  background-color: #f8f9fa;
  box-shadow: 0 0 0 1px #e9ecef;
}

.editing-container {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

/* Edit input styling */
.edit-input {
  width: 100%;
  padding: 0.5rem;
  border: 2px solid #4f46e5;
  border-radius: 4px;
  font-size: 0.9rem;
  font-family: inherit;
  background: white;
  color: #212529;
  outline: none;
  transition: border-color 0.2s ease;
}

.edit-input:focus {
  border-color: #818cf8;
  box-shadow: 0 0 0 3px rgba(129, 140, 248, 0.1);
}

.edit-buttons {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-save {
  background: #10b981;
  color: white;
}

.btn-save:hover {
  background: #059669;
  transform: translateY(-1px);
}

.btn-cancel {
  background: #6b7280;
  color: white;
}

.btn-cancel:hover {
  background: #4b5563;
  transform: translateY(-1px);
}

/* Dark mode editing styles */
:deep(body.dark-mode) .editable-field:hover {
  background-color: #374151;
  box-shadow: 0 0 0 1px #4b5563;
}

:deep(body.dark-mode) .edit-input {
  background: #374151;
  color: #f9fafb;
  border-color: #818cf8;
}

:deep(body.dark-mode) .edit-input:focus {
  background: #1f2937;
  border-color: #a5b4fc;
}

:deep(body.dark-mode) .btn-save {
  background: #059669;
}

:deep(body.dark-mode) .btn-save:hover {
  background: #047857;
}

:deep(body.dark-mode) .btn-cancel {
  background: #4b5563;
}

:deep(body.dark-mode) .btn-cancel:hover {
  background: #374151;
}

.action-button.cancel {
  background-color: #dc2626;
}

.action-button.cancel:hover {
  background-color: #b91c1c;
}

.action-button.cancel-verification {
  background-color: #f59e0b;
}

.action-button.cancel-verification:hover {
  background-color: #d97706;
}

.target-user-container {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.inactive-user-indicator {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  margin-top: 0.25rem;
}

.inactive-user-indicator .text-orange-500 {
  color: #f97316;
}

.inactive-user-indicator .text-sm {
  font-size: 0.875rem;
}

.inactive-user-indicator .font-medium {
  font-weight: 500;
}

/* Dark mode styles for inactive user indicator */
:deep(body.dark-mode) .inactive-user-indicator .text-orange-500 {
  color: #fb923c;
}

:deep(body.dark-mode) .description-text {
  color: #e5e7eb;
}

/* Add comprehensive dark mode styles for v-html content */
:deep(body.dark-mode) .description-text :deep(p),
:deep(body.dark-mode) .description-text :deep(div),
:deep(body.dark-mode) .description-text :deep(span) {
  color: #e5e7eb !important;
}

:deep(body.dark-mode) .description-text :deep(h1),
:deep(body.dark-mode) .description-text :deep(h2),
:deep(body.dark-mode) .description-text :deep(h3),
:deep(body.dark-mode) .description-text :deep(h4),
:deep(body.dark-mode) .description-text :deep(h5),
:deep(body.dark-mode) .description-text :deep(h6) {
  color: #f9fafb;
}

:deep(body.dark-mode) .description-text :deep(blockquote) {
  border-left-color: #4b5563;
  background: #1f2937;
}

:deep(body.dark-mode) .description-text :deep(code) {
  background: #1f2937;
  color: #e5e7eb;
}

:deep(body.dark-mode) .description-text :deep(pre) {
  background: #1f2937;
  color: #e5e7eb;
}

:deep(body.dark-mode) .description-text :deep(.ql-syntax) {
  background: #1f2937;
  color: #e5e7eb;
  border-color: #374151;
}

:deep(body.dark-mode) .description-text :deep(.ql-size-small),
:deep(body.dark-mode) .description-text :deep(.ql-size-large),
:deep(body.dark-mode) .description-text :deep(.ql-size-huge) {
  color: #e5e7eb;
}

:deep(body.dark-mode) .description-text :deep(a) {
  color: #60a5fa;
}

/* Dark mode comment text styles */
:deep(body.dark-mode) .comment-text {
  color: #e5e7eb;
}

:deep(body.dark-mode) .comment-text :deep(p),
:deep(body.dark-mode) .comment-text :deep(div),
:deep(body.dark-mode) .comment-text :deep(span) {
  color: #e5e7eb !important;
}

:deep(body.dark-mode) .comment-text :deep(h1),
:deep(body.dark-mode) .comment-text :deep(h2),
:deep(body.dark-mode) .comment-text :deep(h3),
:deep(body.dark-mode) .comment-text :deep(h4),
:deep(body.dark-mode) .comment-text :deep(h5),
:deep(body.dark-mode) .comment-text :deep(h6) {
  color: #f9fafb;
}

:deep(body.dark-mode) .comment-text :deep(blockquote) {
  border-left-color: #4b5563;
  background: #1f2937;
}

:deep(body.dark-mode) .comment-text :deep(code) {
  background: #1f2937;
  color: #e5e7eb;
}

:deep(body.dark-mode) .comment-text :deep(pre) {
  background: #1f2937;
  color: #e5e7eb;
}

:deep(body.dark-mode) .comment-text :deep(strong) {
  color: #f3f4f6;
}

:deep(body.dark-mode) .comment-text :deep(em) {
  color: #e5e7eb;
}

:deep(body.dark-mode) .comment-text :deep(ul),
:deep(body.dark-mode) .comment-text :deep(ol) {
  color: #e5e7eb;
}

:deep(body.dark-mode) .comment-text :deep(li) {
  color: #e5e7eb;
}

/* General dark mode styles for any v-html content */
:deep(body.dark-mode) [v-html] {
  color: #e5e7eb;
}

:deep(body.dark-mode) [v-html] :deep(p),
:deep(body.dark-mode) [v-html] :deep(div),
:deep(body.dark-mode) [v-html] :deep(span) {
  color: inherit !important;
}

:deep(body.dark-mode) [v-html] :deep(strong) {
  color: #f3f4f6;
}

:deep(body.dark-mode) [v-html] :deep(em) {
  color: inherit;
}

:deep(body.dark-mode) [v-html] :deep(a) {
  color: #60a5fa;
}

/* Ensure system update descriptions have proper dark mode styling */
:deep(body.dark-mode) .text-gray-600[v-html],
:deep(body.dark-mode) .text-gray-600 [v-html] {
  color: #d1d5db !important;
}

:deep(body.dark-mode) .text-gray-600[v-html] :deep(p),
:deep(body.dark-mode) .text-gray-600[v-html] :deep(div),
:deep(body.dark-mode) .text-gray-600[v-html] :deep(span),
:deep(body.dark-mode) .text-gray-600 [v-html] :deep(p),
:deep(body.dark-mode) .text-gray-600 [v-html] :deep(div),
:deep(body.dark-mode) .text-gray-600 [v-html] :deep(span) {
  color: #d1d5db !important;
}

/* Add comprehensive dark mode styles for v-html content */
.dark .description-text,
.dark .description-text *,
:deep(.dark) .description-text,
:deep(.dark) .description-text * {
  color: #e5e7eb !important;
}

.dark .description-text p,
.dark .description-text div,
.dark .description-text span,
:deep(.dark) .description-text p,
:deep(.dark) .description-text div,
:deep(.dark) .description-text span {
  color: #e5e7eb !important;
}

.dark .description-text h1,
.dark .description-text h2,
.dark .description-text h3,
.dark .description-text h4,
.dark .description-text h5,
.dark .description-text h6,
:deep(.dark) .description-text h1,
:deep(.dark) .description-text h2,
:deep(.dark) .description-text h3,
:deep(.dark) .description-text h4,
:deep(.dark) .description-text h5,
:deep(.dark) .description-text h6 {
  color: #f9fafb !important;
}

.dark .description-text strong,
:deep(.dark) .description-text strong {
  color: #f3f4f6 !important;
}

.dark .description-text a,
:deep(.dark) .description-text a {
  color: #60a5fa !important;
}

/* Dark mode comment text styles */
.dark .comment-text,
.dark .comment-text *,
:deep(.dark) .comment-text,
:deep(.dark) .comment-text * {
  color: #e5e7eb !important;
}

.dark .comment-text p,
.dark .comment-text div,
.dark .comment-text span,
:deep(.dark) .comment-text p,
:deep(.dark) .comment-text div,
:deep(.dark) .comment-text span {
  color: #e5e7eb !important;
}

.dark .comment-text h1,
.dark .comment-text h2,
.dark .comment-text h3,
.dark .comment-text h4,
.dark .comment-text h5,
.dark .comment-text h6,
:deep(.dark) .comment-text h1,
:deep(.dark) .comment-text h2,
:deep(.dark) .comment-text h3,
:deep(.dark) .comment-text h4,
:deep(.dark) .comment-text h5,
:deep(.dark) .comment-text h6 {
  color: #f9fafb !important;
}

.dark .comment-text strong,
:deep(.dark) .comment-text strong {
  color: #f3f4f6 !important;
}

.dark .comment-text a,
:deep(.dark) .comment-text a {
  color: #60a5fa !important;
}

/* Force override for v-html content in dark mode */
:deep(.dark) .text-gray-800 .description-text,
:deep(.dark) .text-gray-800 .description-text *,
:deep(.dark) .text-gray-800 .comment-text,
:deep(.dark) .text-gray-800 .comment-text * {
  color: #e5e7eb !important;
}

/* Also support body.dark-mode pattern */
:deep(body.dark-mode) .description-text,
:deep(body.dark-mode) .description-text *,
body.dark-mode .description-text,
body.dark-mode .description-text * {
  color: #e5e7eb !important;
}

:deep(body.dark-mode) .comment-text,
:deep(body.dark-mode) .comment-text *,
body.dark-mode .comment-text,
body.dark-mode .comment-text * {
  color: #e5e7eb !important;
}

:deep(body.dark-mode) .text-gray-800 .description-text,
:deep(body.dark-mode) .text-gray-800 .description-text *,
:deep(body.dark-mode) .text-gray-800 .comment-text,
:deep(body.dark-mode) .text-gray-800 .comment-text *,
body.dark-mode .text-gray-800 .description-text,
body.dark-mode .text-gray-800 .description-text *,
body.dark-mode .text-gray-800 .comment-text,
body.dark-mode .text-gray-800 .comment-text * {
  color: #e5e7eb !important;
}

/* Force text color for v-html content in dark mode */
.dark .description-text,
.dark .description-text *,
.dark .comment-text,
.dark .comment-text * {
  color: #e5e7eb !important;
}

/* Ensure text remains visible with proper contrast */
:deep(.description-text),
:deep(.comment-text) {
  color: inherit;
}

.dark :deep(.description-text),
.dark :deep(.comment-text) {
  color: #e5e7eb !important;
}

.dark :deep(.description-text *),
.dark :deep(.comment-text *) {
  color: #e5e7eb !important;
}

/* Force override for v-html content in dark mode */
:deep(.dark) .text-gray-800 .description-text,
:deep(.dark) .text-gray-800 .description-text *,
:deep(.dark) .text-gray-800 .comment-text,
:deep(.dark) .text-gray-800 .comment-text * {
  color: #e5e7eb !important;
}

/* Also support body.dark-mode pattern */
:deep(body.dark-mode) .description-text,
:deep(body.dark-mode) .description-text *,
body.dark-mode .description-text,
body.dark-mode .description-text * {
  color: #e5e7eb !important;
}

:deep(body.dark-mode) .comment-text,
:deep(body.dark-mode) .comment-text *,
body.dark-mode .comment-text,
body.dark-mode .comment-text * {
  color: #e5e7eb !important;
}

:deep(body.dark-mode) .text-gray-800 .description-text,
:deep(body.dark-mode) .text-gray-800 .description-text *,
:deep(body.dark-mode) .text-gray-800 .comment-text,
:deep(body.dark-mode) .text-gray-800 .comment-text *,
body.dark-mode .text-gray-800 .description-text,
body.dark-mode .text-gray-800 .description-text *,
body.dark-mode .text-gray-800 .comment-text,
body.dark-mode .text-gray-800 .comment-text * {
  color: #e5e7eb !important;
}

/* Force text color for v-html content in dark mode - comprehensive solution */
.dark .description-text,
.dark .description-text *,
.dark .comment-text,
.dark .comment-text *,
:deep(.dark) .description-text,
:deep(.dark) .description-text *,
:deep(.dark) .comment-text,
:deep(.dark) .comment-text *,
.dark :deep(.description-text),
.dark :deep(.description-text *),
.dark :deep(.comment-text),
.dark :deep(.comment-text *) {
  color: #e5e7eb !important;
}

/* Override any parent container text color in dark mode */
.dark .text-gray-800 .description-text,
.dark .text-gray-800 .description-text *,
.dark .text-gray-800 .comment-text,
.dark .text-gray-800 .comment-text * {
  color: #e5e7eb !important;
}

/* Dark mode styles for descriptions and comments */
.dark .description-text,
.dark .description-text *,
.dark .comment-text,
.dark .comment-text *,
:deep(.dark) .description-text,
:deep(.dark) .description-text *,
:deep(.dark) .comment-text,
:deep(.dark) .comment-text * {
  color: #e5e7eb !important;
}

/* Override parent container styles in dark mode */
.dark .text-gray-800 .description-text,
.dark .text-gray-800 .description-text *,
.dark .text-gray-800 .comment-text,
.dark .text-gray-800 .comment-text * {
  color: #e5e7eb !important;
}

/* Headings should be slightly brighter */
.dark .description-text h1,
.dark .description-text h2,
.dark .description-text h3,
.dark .description-text h4,
.dark .description-text h5,
.dark .description-text h6,
.dark .comment-text h1,
.dark .comment-text h2,
.dark .comment-text h3,
.dark .comment-text h4,
.dark .comment-text h5,
.dark .comment-text h6 {
  color: #f9fafb !important;
}

/* Links should be blue in dark mode */
.dark .description-text a,
.dark .comment-text a {
  color: #60a5fa !important;
}

/* Skeleton shimmer animation */
@keyframes skeleton-shimmer {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
  100% {
    opacity: 1;
  }
}

.skeleton-shimmer {
  animation: skeleton-shimmer 1.5s ease-in-out infinite;
}
</style>
