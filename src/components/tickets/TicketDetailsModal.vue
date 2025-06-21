<template>
  <BaseModal
    v-if="isOpen"
    :isOpen="isOpen"
    title="Detalhes do Ticket"
    :isLoading="loadedTicket ? false : true"
    @close="closeModal"
    :showFooter="false"
  >
    <div v-if="loadedTicket" class="min-w-[900px] p-6">
      <!-- Assunto em largura total -->
      <div
        class="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg flex items-center gap-3 transition-all duration-300 mb-2 border border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 hover:-translate-y-0.5 hover:shadow-lg hover:border-gray-300 dark:hover:border-gray-500"
      >
        <div
          class="w-8 h-8 min-w-8 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center text-gray-600 dark:text-gray-400 text-sm"
        >
          <font-awesome-icon icon="file-alt" />
        </div>
        <div class="flex-1 flex items-center gap-2">
          <div class="text-xs text-gray-500 dark:text-gray-400 min-w-[85px]">Assunto</div>
          <div class="text-sm text-gray-800 dark:text-gray-100 flex-1" v-if="!isEditingName">
            <span
              @click="startEditingName"
              :class="{
                'cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 px-2 py-1 rounded transition-colors':
                  isRequester,
              }"
              :title="isRequester ? 'Clique para editar' : ''"
            >
              {{ loadedTicket.name }}
            </span>
          </div>
          <div class="text-sm text-gray-800 dark:text-gray-100 flex-1 flex flex-col gap-2" v-else>
            <input
              v-model="editingName"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-all"
              @keyup.enter="saveTicketName"
              @keyup.escape="cancelEditingName"
              ref="nameInput"
            />
            <div class="flex gap-2">
              <button
                @click="saveTicketName"
                class="inline-flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-md transition-all hover:-translate-y-0.5"
              >
                Salvar
              </button>
              <button
                @click="cancelEditingName"
                class="inline-flex items-center gap-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white text-sm font-medium rounded-md transition-all hover:-translate-y-0.5"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="flex gap-6">
        <!-- Coluna da Esquerda - Informações -->
        <div class="flex-1">
          <!-- ID -->
          <div
            class="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg flex items-center gap-3 transition-all duration-300 mb-2 border border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 hover:-translate-y-0.5 hover:shadow-lg hover:border-gray-300 dark:hover:border-gray-500"
          >
            <div
              class="w-8 h-8 min-w-8 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center text-gray-600 dark:text-gray-400 text-sm"
            >
              <font-awesome-icon icon="hashtag" />
            </div>
            <div class="flex-1 flex items-center gap-2">
              <div class="text-xs text-gray-500 dark:text-gray-400 min-w-[85px]">ID</div>
              <div class="text-sm text-gray-800 dark:text-gray-100 flex-1">
                {{ loadedTicket.customId }}
              </div>
            </div>
          </div>

          <!-- Prioridade -->
          <div
            class="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg flex items-center gap-3 transition-all duration-300 mb-2 border border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 hover:-translate-y-0.5 hover:shadow-lg hover:border-gray-300 dark:hover:border-gray-500"
          >
            <div
              class="w-8 h-8 min-w-8 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center text-gray-600 dark:text-gray-400 text-sm"
            >
              <font-awesome-icon icon="exclamation-circle" />
            </div>
            <div class="flex-1 flex items-center gap-2">
              <div class="text-xs text-gray-500 dark:text-gray-400 min-w-[85px]">Prioridade</div>
              <div class="text-sm text-gray-800 dark:text-gray-100 flex-1">
                <span
                  :class="[
                    'inline-flex items-center px-2 py-1 rounded text-sm font-medium gap-2',
                    getPriorityClass(loadedTicket.priority),
                  ]"
                >
                  <font-awesome-icon
                    :icon="getPriorityIcon(loadedTicket.priority)"
                    class="text-sm"
                  />
                  {{ formatSnakeToNaturalCase(loadedTicket.priority) }}
                </span>
              </div>
            </div>
          </div>

          <!-- Status -->
          <div
            class="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg flex items-center gap-3 transition-all duration-300 mb-2 border border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 hover:-translate-y-0.5 hover:shadow-lg hover:border-gray-300 dark:hover:border-gray-500"
          >
            <div
              class="w-8 h-8 min-w-8 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center text-gray-600 dark:text-gray-400 text-sm"
            >
              <font-awesome-icon icon="clock" />
            </div>
            <div class="flex-1 flex items-center gap-2">
              <div class="text-xs text-gray-500 dark:text-gray-400 min-w-[85px]">Status</div>
              <div class="text-sm text-gray-800 dark:text-gray-100 flex-1">
                <span
                  :class="[
                    'inline-flex items-center px-2 py-1 rounded text-sm font-medium gap-2',
                    getStatusClass(loadedTicket.status),
                  ]"
                >
                  <font-awesome-icon :icon="getStatusIcon(loadedTicket.status)" class="text-sm" />
                  {{ formatSnakeToNaturalCase(loadedTicket?.status!).toUpperCase() }}
                </span>
              </div>
            </div>
          </div>

          <!-- Solicitante e Setor -->
          <div
            class="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg flex items-center gap-3 transition-all duration-300 mb-2 border border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 hover:-translate-y-0.5 hover:shadow-lg hover:border-gray-300 dark:hover:border-gray-500"
          >
            <div
              class="w-8 h-8 min-w-8 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center text-gray-600 dark:text-gray-400 text-sm"
            >
              <font-awesome-icon icon="user-tie" />
            </div>
            <div class="flex-1 flex items-center gap-2">
              <div class="text-xs text-gray-500 dark:text-gray-400 min-w-[85px]">
                Solicitante / Setor
              </div>
              <div class="text-sm text-gray-800 dark:text-gray-100 flex-1">
                {{ loadedTicket.requester.firstName }} {{ loadedTicket.requester.lastName }} /
                {{ loadedTicket.department.name }}
              </div>
            </div>
          </div>

          <!-- Responsável -->
          <div
            class="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg flex items-center gap-3 transition-all duration-300 mb-2 border border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 hover:-translate-y-0.5 hover:shadow-lg hover:border-gray-300 dark:hover:border-gray-500"
          >
            <div
              class="w-8 h-8 min-w-8 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center text-gray-600 dark:text-gray-400 text-sm"
            >
              <font-awesome-icon icon="user" />
            </div>
            <div class="flex-1 flex items-center gap-2">
              <div class="text-xs text-gray-500 dark:text-gray-400 min-w-[85px]">Responsável</div>
              <div class="text-sm text-gray-800 dark:text-gray-100 flex-1">
                <div class="flex gap-2">
                  <span
                    >{{ loadedTicket.targetUser.firstName }}
                    {{ loadedTicket.targetUser.lastName }}</span
                  >
                  <div
                    v-if="!loadedTicket.targetUser.isActive"
                    class="flex items-center gap-1.5"
                    title="Conta desativada"
                  >
                    <font-awesome-icon
                      icon="exclamation-triangle"
                      class="text-orange-500 text-sm"
                    />
                    <span class="text-orange-500 text-xs font-medium">Desativado</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Concluir até -->
          <div
            class="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg flex items-center gap-3 transition-all duration-300 mb-2 border border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 hover:-translate-y-0.5 hover:shadow-lg hover:border-gray-300 dark:hover:border-gray-500"
          >
            <div
              class="w-8 h-8 min-w-8 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center text-gray-600 dark:text-gray-400 text-sm"
            >
              <font-awesome-icon icon="calendar-check" />
            </div>
            <div class="flex-1 flex items-center gap-2">
              <div class="text-xs text-gray-500 dark:text-gray-400 min-w-[85px]">Concluir até</div>
              <div class="text-sm text-gray-800 dark:text-gray-100 flex-1">
                {{ formatDate(loadedTicket.dueAt) }}
              </div>
            </div>
          </div>

          <!-- Prazo -->
          <div
            class="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg flex items-center gap-3 transition-all duration-300 mb-2 border border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 hover:-translate-y-0.5 hover:shadow-lg hover:border-gray-300 dark:hover:border-gray-500"
            :class="getDeadlineClass(loadedTicket.dueAt)"
          >
            <div
              class="w-8 h-8 min-w-8 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center text-gray-600 dark:text-gray-400 text-sm"
            >
              <font-awesome-icon icon="hourglass-end" />
            </div>
            <div class="flex-1 flex items-center gap-2">
              <div class="text-xs text-gray-500 dark:text-gray-400 min-w-[85px]">Prazo</div>
              <div class="text-sm text-gray-800 dark:text-gray-100 flex-1">
                {{ calculateDeadline(loadedTicket) }}
                <font-awesome-icon
                  v-if="isPastDeadline(loadedTicket.dueAt)"
                  icon="exclamation-triangle"
                  class="text-sm text-orange-500 ml-1"
                />
              </div>
            </div>
          </div>

          <!-- Privacidade -->
          <div
            class="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg flex items-center gap-3 transition-all duration-300 mb-2 border border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 hover:-translate-y-0.5 hover:shadow-lg hover:border-gray-300 dark:hover:border-gray-500"
          >
            <div
              class="w-8 h-8 min-w-8 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center text-gray-600 dark:text-gray-400 text-sm"
            >
              <font-awesome-icon icon="lock" />
            </div>
            <div class="flex-1 flex items-center gap-2">
              <div class="text-xs text-gray-500 dark:text-gray-400 min-w-[85px]">Privacidade</div>
              <div class="text-sm text-gray-800 dark:text-gray-100 flex-1">
                {{ loadedTicket.isPrivate ? 'Privado' : 'Público' }}
              </div>
            </div>
          </div>

          <!-- Aceite em -->
          <div
            class="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg flex items-center gap-3 transition-all duration-300 mb-2 border border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 hover:-translate-y-0.5 hover:shadow-lg hover:border-gray-300 dark:hover:border-gray-500"
          >
            <div
              class="w-8 h-8 min-w-8 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center text-gray-600 dark:text-gray-400 text-sm"
            >
              <font-awesome-icon icon="user-check" />
            </div>
            <div class="flex-1 flex items-center gap-2">
              <div class="text-xs text-gray-500 dark:text-gray-400 min-w-[85px]">Aceite em</div>
              <div class="text-sm text-gray-800 dark:text-gray-100 flex-1">
                {{ formatDate(loadedTicket.acceptedAt) }}
              </div>
            </div>
          </div>

          <!-- Categoria -->
          <div
            class="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg flex items-center gap-3 transition-all duration-300 mb-2 border border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 hover:-translate-y-0.5 hover:shadow-lg hover:border-gray-300 dark:hover:border-gray-500"
          >
            <div
              class="w-8 h-8 min-w-8 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center text-gray-600 dark:text-gray-400 text-sm"
            >
              <font-awesome-icon icon="folder" />
            </div>
            <div class="flex-1 flex items-center gap-2">
              <div class="text-xs text-gray-500 dark:text-gray-400 min-w-[85px]">Categoria</div>
              <div class="text-sm text-gray-800 dark:text-gray-100 flex-1">
                {{ loadedTicket.category?.name || '-' }}
              </div>
            </div>
          </div>
        </div>

        <!-- Coluna da Direita - Descrição -->
        <div class="flex-1">
          <div
            class="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg transition-all duration-300 mb-2 border border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 hover:-translate-y-0.5 hover:shadow-lg hover:border-gray-300 dark:hover:border-gray-500"
          >
            <div class="flex items-center gap-3">
              <div
                class="w-8 h-8 min-w-8 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center text-gray-600 dark:text-gray-400 text-sm"
              >
                <font-awesome-icon icon="file-alt" />
              </div>
              <div class="text-xs text-gray-500 dark:text-gray-400 min-w-[85px]">Descrição</div>
            </div>
            <div class="mt-2">
              <div class="text-sm text-gray-800 dark:text-gray-100" v-if="!isEditingDescription">
                <div
                  class="description-text"
                  v-html="loadedTicket.description"
                  @click="startEditingDescription"
                  :class="{
                    'cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 px-2 py-1 rounded transition-colors':
                      isRequester,
                  }"
                  :title="isRequester ? 'Clique para editar' : ''"
                ></div>
              </div>
              <div class="text-sm text-gray-800 dark:text-gray-100 flex flex-col gap-2" v-else>
                <div class="quill-wrapper">
                  <QuillEditor
                    :key="descriptionEditorKey"
                    v-model:content="editingDescription"
                    contentType="html"
                    theme="snow"
                    :options="editorOptions"
                  />
                </div>
                <div class="flex gap-2">
                  <button
                    @click="saveTicketDescription"
                    class="inline-flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-md transition-all hover:-translate-y-0.5"
                  >
                    Salvar
                  </button>
                  <button
                    @click="cancelEditingDescription"
                    class="inline-flex items-center gap-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white text-sm font-medium rounded-md transition-all hover:-translate-y-0.5"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        class="flex justify-end gap-4 mt-6 pt-6 border-t border-gray-200 dark:border-gray-600"
        v-if="
          isTargetUser || (isRequester && loadedTicket.status === TicketStatus.UnderVerification)
        "
      >
        <button
          v-if="isTargetUser && loadedTicket?.status === TicketStatus.Pending"
          class="inline-flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded cursor-pointer transition-all hover:-translate-y-0.5"
          @click="acceptTicket(loadedTicket?.customId)"
        >
          <font-awesome-icon icon="check" /> Aceitar
        </button>
        <button
          v-if="isTargetUser && loadedTicket?.status === TicketStatus.InProgress"
          class="inline-flex items-center gap-2 px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white text-sm font-medium rounded cursor-pointer transition-all hover:-translate-y-0.5"
          @click="sendForReview(loadedTicket.customId)"
        >
          <font-awesome-icon icon="arrow-right" /> Enviar para Verificação
        </button>
        <button
          v-if="isTargetUser && loadedTicket?.status === TicketStatus.AwaitingVerification"
          class="inline-flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-sm font-medium rounded cursor-pointer transition-all hover:-translate-y-0.5"
          @click="cancelVerificationRequest(loadedTicket.customId)"
        >
          <font-awesome-icon icon="undo" /> Cancelar envio para verificação
        </button>
        <button
          v-if="isTargetUser && loadedTicket?.status === TicketStatus.Returned"
          class="inline-flex items-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white text-sm font-medium rounded cursor-pointer transition-all hover:-translate-y-0.5"
          @click="correctTicket(loadedTicket.customId)"
        >
          <font-awesome-icon icon="wrench" /> Corrigir
        </button>
        <button
          v-if="isRequester && loadedTicket?.status === TicketStatus.UnderVerification"
          class="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded cursor-pointer transition-all hover:-translate-y-0.5"
          @click="approveTicket(loadedTicket.customId)"
        >
          <font-awesome-icon icon="check-double" /> Aprovar
        </button>
        <button
          v-if="isRequester && loadedTicket?.status === TicketStatus.UnderVerification"
          class="inline-flex items-center gap-2 px-4 py-2 bg-purple-700 hover:bg-purple-800 text-white text-sm font-medium rounded cursor-pointer transition-all hover:-translate-y-0.5"
          @click="requestCorrection(loadedTicket.customId)"
        >
          <font-awesome-icon icon="undo" /> Solicitar Correção
        </button>

        <button
          v-if="isRequester && loadedTicket?.status === TicketStatus.UnderVerification"
          class="inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded cursor-pointer transition-all hover:-translate-y-0.5"
          @click="rejectTicket(loadedTicket.customId)"
        >
          <font-awesome-icon icon="undo" /> Reprovar
        </button>
      </div>

      <div class="flex items-center justify-between mt-6">
        <div class="flex items-center gap-3">
          <p class="text-sm font-medium text-gray-700 dark:text-gray-300">Anexos</p>
          <div
            class="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-2 py-1 rounded-full text-xs font-medium"
          >
            {{ loadedTicket.files.length }}
          </div>
        </div>
        <button
          v-if="canEditTicket"
          class="inline-flex items-center justify-center w-8 h-8 primary-gradient text-white rounded-full transition-colors"
          @click="openFileInput"
          title="Adicionar anexos"
        >
          <font-awesome-icon icon="plus" />
        </button>
        <input class="hidden" type="file" ref="fileInput" multiple @change="handleFileChange" />
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
        <div
          v-for="file in loadedTicket.files"
          :key="file.id"
          class="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
          @click="downloadFile(file)"
        >
          <div class="text-blue-600 dark:text-blue-400">
            <font-awesome-icon icon="file" size="xl" />
          </div>
          <div class="flex-1 min-w-0">
            <div class="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
              {{ file.name }}
            </div>
          </div>
        </div>
        <div
          v-for="(file, i) in selectedFiles"
          :key="`new-${i}`"
          class="flex items-center gap-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg"
        >
          <div class="text-yellow-600 dark:text-yellow-400">
            <font-awesome-icon icon="file-upload" size="xl" />
          </div>
          <div class="flex-1 min-w-0">
            <div class="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
              {{ file.name }}
            </div>
          </div>
        </div>
      </div>

      <!-- Nova div separada para o botão de cancelar -->
      <div
        class="flex justify-end gap-4 mt-6 pt-6 border-t border-gray-200 dark:border-gray-600"
        v-if="
          isRequester &&
          loadedTicket.status !== TicketStatus.Completed &&
          loadedTicket.status !== TicketStatus.Rejected &&
          loadedTicket.status !== TicketStatus.Canceled
        "
      >
        <button
          class="inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded cursor-pointer transition-all hover:-translate-y-0.5"
          @click="cancelTicket(loadedTicket.customId)"
        >
          <font-awesome-icon icon="ban" /> Cancelar
        </button>
      </div>

      <div class="mt-8 bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
        <div class="flex items-center gap-2 mb-4 text-gray-600 dark:text-gray-400">
          <font-awesome-icon icon="comments" />
          <h3 class="text-lg font-semibold">Comentários</h3>
        </div>
        <div
          v-if="
            loadedTicket?.status === TicketStatus.InProgress ||
            loadedTicket?.status === TicketStatus.UnderVerification
          "
          class="flex flex-col gap-4"
        >
          <div
            class="bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 overflow-hidden"
          >
            <QuillEditor
              :key="editorKey"
              ref="quillEditor"
              v-model:content="newComment"
              contentType="html"
              theme="snow"
              :options="editorOptions"
            />
          </div>
          <button
            @click="comment()"
            class="inline-flex items-center gap-2 px-4 py-2 primary-gradient hover:bg-blue-700 text-white text-sm font-medium rounded transition-all hover:-translate-y-0.5 self-end"
          >
            <font-awesome-icon icon="paper-plane" /> Enviar
          </button>
        </div>
        <div
          v-else
          class="flex items-center gap-3 p-4 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300 rounded-lg border border-yellow-200 dark:border-yellow-800"
        >
          <font-awesome-icon icon="ban" />
          <p class="text-sm">
            Comentários permitidos apenas para tickets em andamento ou em verificação
          </p>
        </div>

        <div class="mt-6 relative">
          <div class="absolute left-5 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-600 z-0"></div>
          <div v-for="event in timeline" :key="event.data.id">
            <div
              class="flex gap-4 p-4 bg-white dark:bg-gray-700 rounded-lg mb-4 shadow-sm relative z-10"
              v-if="event.type === 'comment'"
            >
              <div
                class="w-10 h-10 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center text-gray-600 dark:text-gray-400 text-lg border-2 border-white dark:border-gray-700 z-20"
              >
                <font-awesome-icon icon="user-circle" />
              </div>
              <div class="flex-1">
                <div class="flex justify-between items-center mb-2">
                  <span class="font-medium text-gray-900 dark:text-gray-100"
                    >{{ event.data.user.firstName }} {{ event.data.user.lastName }}</span
                  >
                  <span class="text-xs text-gray-500 dark:text-gray-400">{{
                    formatRelativeTime(event.createdAt)
                  }}</span>
                </div>
                <div
                  class="text-gray-600 dark:text-gray-300 comment-text"
                  v-html="event.data.content"
                ></div>
              </div>
            </div>

            <div
              class="flex gap-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg mb-4 border border-gray-200 dark:border-gray-600 relative z-10"
              v-else-if="event.type === 'specialUpdate'"
              :class="event.subType"
            >
              <div
                class="w-8 h-8 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center text-gray-600 dark:text-gray-400 text-sm border-2 border-white dark:border-gray-700 z-20"
                :class="event.subType"
              >
                <span class="text-xs font-medium">{{
                  getUserInitials(loadedTicket?.requester)
                }}</span>
              </div>
              <div class="flex-1">
                <div class="flex justify-between items-center mb-1">
                  <span
                    class="font-medium text-sm text-gray-700 dark:text-gray-300"
                    :class="event.subType"
                    >{{ getSpecialUpdateTitle(event.subType, event) }}</span
                  >
                  <span class="text-xs text-gray-500 dark:text-gray-400">{{
                    formatRelativeTime(event.createdAt)
                  }}</span>
                </div>
                <div class="text-sm text-gray-600 dark:text-gray-400">{{ event.data.content }}</div>
              </div>
            </div>

            <div
              class="flex items-center gap-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg mb-4 border border-gray-200 dark:border-gray-600 relative z-10 shadow-sm"
              v-else
            >
              <div
                class="w-8 h-8 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center text-gray-600 dark:text-gray-400 text-xl border-2 border-white dark:border-gray-700 z-20"
              >
                <font-awesome-icon :icon="getEventIcon(event.data.description)" />
              </div>
              <div class="flex-1">
                <div class="flex justify-between items-center w-full">
                  <div
                    class="text-sm text-gray-600 dark:text-gray-400"
                    v-html="formatTicketUpdateDescription(event.data)"
                  ></div>
                  <span class="text-xs text-gray-500 dark:text-gray-400 ml-2">{{
                    formatRelativeTime(event.createdAt)
                  }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </BaseModal>

  <ConfirmationModal
    v-if="confirmationModal.isOpen"
    :isOpen="confirmationModal.isOpen"
    :title="confirmationModal.title"
    :message="confirmationModal.message"
    :hasInput="confirmationModal.hasInput"
    :reasonOptions="confirmationModal.reasonOptions"
    @confirm="handleConfirm"
    @cancel="handleCancel"
  />
</template>

<script setup lang="ts">
import BaseModal from '../common/BaseModal.vue';
import { CancellationReason, TicketStatus, type Ticket, type TicketComment } from '@/models';
import { ref, computed, watch, nextTick } from 'vue';
import { ticketCommentService } from '@/services/ticketCommentService';
import { ticketService } from '@/services/ticketService';
import { useUserStore } from '@/stores/user';
import { useTicketsStore } from '@/stores/tickets';
import { toast } from 'vue3-toastify';
import { formatRelativeTime } from '@/utils/date';
import ConfirmationModal from '../common/ConfirmationModal.vue';
import {
  calculateDeadline,
  formatSnakeToNaturalCase,
  getUserInitials,
  enumToOptions,
} from '@/utils/generic-helper';
import type { TicketUpdate } from '@/models/ticketUpdate';
import { TicketUpdateService } from '@/services/ticketUpdateService';
import type { TicketFile } from '@/models/ticketFile';
import { awsService } from '@/services/awsService';
import axios from 'axios';
import { CorrectionReason, DisapprovalReason } from '@/models';
import { QuillEditor } from '@vueup/vue-quill';
import '@vueup/vue-quill/dist/vue-quill.snow.css';

interface SpecialUpdateEvent {
  data?: {
    reason?: string;
    content?: string;
    id?: string | number;
  };
}

const props = defineProps<{
  isOpen: boolean;
  ticket: Ticket | null;
}>();

const emit = defineEmits(['close', 'refresh']);
const userStore = useUserStore();
const ticketsStore = useTicketsStore();
const newComment = ref('');
const quillEditor = ref<any>(null);
const editorKey = ref(0);
const comments = ref<TicketComment[]>([]);
const ticketUpdates = ref<TicketUpdate[]>([]);
const loadedTicket = ref<Ticket | null>(null);
const selectedFiles = ref<File[]>([]);
const fileInput = ref<HTMLInputElement | null>(null);
const isUploading = ref(false);

// Editing states
const isEditingName = ref(false);
const isEditingDescription = ref(false);
const editingName = ref('');
const editingDescription = ref('');
const descriptionEditorKey = ref(0);
const nameInput = ref<HTMLInputElement | null>(null);

const confirmationModal = ref({
  isOpen: false,
  title: '',
  message: '',
  action: null as ((data?: { reason: string; description: string }) => Promise<void>) | null,
  hasInput: false,
  reasonOptions: [] as { value: string; label: string }[],
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
  placeholder: 'Digite seu comentário aqui...',
};

const closeModal = () => {
  emit('close');
};

const formatDate = (date?: string) => (date ? new Date(date).toLocaleDateString() : '—');

const getPriorityClass = (priority: string) => {
  switch (priority) {
    case 'baixa':
      return 'priority-baixa';
    case 'média':
      return 'priority-media';
    case 'alta':
      return 'priority-alta';
    default:
      return '';
  }
};

const getStatusClass = (status: string) => {
  switch (status) {
    case TicketStatus.Pending:
      return 'status-pendente';
    case TicketStatus.InProgress:
      return 'status-em-andamento';
    case TicketStatus.AwaitingVerification:
      return 'status-aguardando-verificacao';
    case TicketStatus.UnderVerification:
      return 'status-em-verificacao';
    case TicketStatus.Completed:
      return 'status-finalizado';
    case TicketStatus.Rejected:
      return 'status-cancelado';
    case TicketStatus.Returned:
      return 'status-devolvido';
    default:
      return '';
  }
};

const isPastDeadline = (date?: string) => {
  if (!date) return false;
  const deadline = new Date(date);
  const today = new Date();

  // Reset hours to compare just dates
  deadline.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  const diffTime = deadline.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return diffDays <= 3;
};

const getDeadlineClass = (date?: string) => {
  if (!date) return '';
  const deadline = new Date(date);
  const today = new Date();

  deadline.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  const diffTime = deadline.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays <= 3) return 'deadline-danger';
  return 'deadline-normal';
};

const openConfirmationModal = (
  title: string,
  message: string,
  action: (data?: { reason: string; description: string }) => Promise<void>,
  hasInput = false,
  reasonOptions: { value: string; label: string }[] = [],
) => {
  confirmationModal.value = {
    isOpen: true,
    title,
    message,
    action,
    hasInput,
    reasonOptions,
  };
};

const closeConfirmationModal = () => {
  confirmationModal.value.isOpen = false;
  confirmationModal.value.action = null;
};

const handleConfirm = async (data?: { reason: string; description: string }) => {
  if (confirmationModal.value.action) {
    if (data) {
      await confirmationModal.value.action(data);
    } else {
      await confirmationModal.value.action();
    }
  }
  closeConfirmationModal();
};

const handleCancel = () => {
  closeConfirmationModal();
};

const acceptTicket = async (ticketId: string) => {
  openConfirmationModal(
    'Aceitar Ticket',
    'Tem certeza que deseja aceitar este ticket?',
    async () => {
      try {
        await ticketService.accept(ticketId);
        toast.success('Ticket aceito com sucesso');

        emit('refresh');
      } catch {
        toast.error('Erro ao aceitar o ticket');
      }
    },
  );
};

const sendForReview = async (ticketId: string) => {
  openConfirmationModal(
    'Enviar Para Revisão',
    'Tem certeza que deseja enviar este ticket para revisão?',
    async () => {
      try {
        await ticketService.updateStatus(ticketId, { status: TicketStatus.AwaitingVerification });
        toast.success('Ticket enviado para revisão');

        emit('refresh');
      } catch {
        toast.error('Erro ao enviar o ticket para revisão');
      }
    },
  );
};

const approveTicket = async (ticketId: string) => {
  openConfirmationModal(
    'Aprovar Ticket',
    'Tem certeza que deseja aprovar este ticket?',
    async () => {
      try {
        await ticketService.approve(ticketId);
        toast.success('Ticket aprovado com sucesso');

        if (props.ticket) {
          emit('refresh');
        } else {
          await ticketsStore.fetchTicketDetails(ticketId);
        }
      } catch {
        toast.error('Erro ao aprovar o ticket');
      }
    },
  );
};

const requestCorrection = async (ticketId: string) => {
  const reasonOptions = enumToOptions(CorrectionReason);
  openConfirmationModal(
    'Solicitar Correção',
    'Por favor, preencha os detalhes da correção necessária:',
    async (data?: { reason: string; description: string }) => {
      try {
        await ticketService.requestCorrection(ticketId, {
          reason: data?.reason ?? '',
          details: data?.description ?? '',
        });

        toast.success('Correção solicitada com sucesso');

        emit('refresh');
      } catch {
        toast.error('Erro ao solicitar correção');
      }
    },
    true,
    reasonOptions,
  );
};

const correctTicket = async (ticketId: string) => {
  openConfirmationModal(
    'Corrigir Ticket',
    'Tem certeza que deseja iniciar as correções deste ticket?',
    async () => {
      try {
        await ticketService.updateStatus(ticketId, { status: TicketStatus.InProgress });
        toast.success('Ticket em correção');
        emit('refresh');
      } catch {
        toast.error('Erro ao iniciar correção');
      }
    },
  );
};

const rejectTicket = async (ticketId: string) => {
  const reasonOptions = enumToOptions(DisapprovalReason);
  openConfirmationModal(
    'Reprovar Ticket',
    'Por favor, informe o motivo da reprovação:',
    async (data?: { reason: string; description: string }) => {
      try {
        await ticketService.reject(ticketId, {
          reason: data?.reason ?? '',
          details: data?.description ?? '',
        });

        toast.success('Ticket reprovado com sucesso');

        emit('refresh');
      } catch {
        toast.error('Erro ao reprovar o ticket');
      }
    },
    true,
    reasonOptions,
  );
};

const cancelTicket = async (ticketId: string) => {
  const reasonOptions = enumToOptions(CancellationReason);
  openConfirmationModal(
    'Cancelar Ticket',
    'Por favor, informe o motivo do cancelamento:',
    async (data?: { reason: string; description: string }) => {
      try {
        await ticketService.cancel(ticketId, {
          reason: data?.reason ?? '',
          details: data?.description ?? '',
        });

        toast.success('Ticket cancelado com sucesso');

        refreshSelectedTicket();

        emit('close');
      } catch {
        toast.error('Erro ao cancelar o ticket');
      }
    },
    true,
    reasonOptions,
  );
};

const downloadFile = (file: TicketFile) => {
  const link = document.createElement('a');
  link.href = file.url;
  link.download = file.name;
  link.target = '_blank';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const comment = async () => {
  // Create a temporary div to strip HTML and check if content is actually empty
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = newComment.value;
  const textContent = tempDiv.textContent || tempDiv.innerText || '';

  if (!textContent.trim()) {
    toast.error('Comentário não pode estar vazio');
    return;
  }

  try {
    await ticketCommentService.create({
      ticketId: loadedTicket.value!.id,
      ticketCustomId: loadedTicket.value!.customId,
      userId: userStore.user!.id,
      content: newComment.value,
    });

    fetchComments();

    if (loadedTicket.value?.customId) {
      await ticketsStore.fetchTicketDetails(loadedTicket.value.customId);
    }

    // Clear the editor by resetting the content and forcing re-render
    newComment.value = '';
    editorKey.value += 1; // Force component re-render
  } catch {
    toast.error('Erro ao adicionar comentário');
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

const fetchTicketUpdates = async () => {
  try {
    if (loadedTicket.value) {
      const response = await TicketUpdateService.getByTicket(loadedTicket.value.customId);
      ticketUpdates.value = response.data;
    }
  } catch (err) {
    console.error(err);
    toast.error('Erro ao buscar atualizações');
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

const isTargetUser = computed(() => userStore.user?.id === loadedTicket.value?.targetUser.id);
const isRequester = computed(() => userStore.user?.id === loadedTicket.value?.requester.id);

const formatTicketUpdateDescription = (ticketUpdate: TicketUpdate) => {
  return `${ticketUpdate.description.replace('user', `${ticketUpdate.performedBy.firstName} ${ticketUpdate.performedBy.lastName}`)}`;
};

const getPriorityIcon = (priority: string) => {
  switch (priority) {
    case 'Baixa':
      return 'arrow-down';
    case 'Média':
      return 'minus';
    case 'Alta':
      return 'arrow-up';
    default:
      return 'exclamation-circle';
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case TicketStatus.Pending:
      return 'clock';
    case TicketStatus.InProgress:
      return 'spinner';
    case TicketStatus.AwaitingVerification:
      return 'hourglass-half';
    case TicketStatus.UnderVerification:
      return 'search';
    case TicketStatus.Completed:
      return 'check-circle';
    case TicketStatus.Rejected:
      return 'times-circle';
    case TicketStatus.Returned:
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
        return 'Ticket Reprovado';
      case 'cancellation':
        return 'Ticket Cancelado';
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

watch(
  () => props.isOpen,
  (isOpen) => {
    if (isOpen && props.ticket?.customId) {
      fetchComments();
      fetchTicketUpdates();
    }
  },
);

watch(
  () => props.ticket,
  (newTicket) => {
    if (newTicket) {
      loadedTicket.value = newTicket;
      fetchComments();
      fetchTicketUpdates();
    }
  },
  { immediate: true },
);

watch(
  () => props.isOpen,
  (isOpen) => {
    if (!isOpen) {
      loadedTicket.value = null;
    }
  },
);

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
      const ext = file.name.split('.').pop();

      if (ext) {
        const { data } = await awsService.getSignedUrl(ext);

        await axios.put(data.url, file, {
          headers: {
            'Content-Type': file.type,
          },
        });

        const fileUrl = data.url.split('?')[0];
        uploadedUrls.push(fileUrl);
      }
    }

    if (uploadedUrls.length > 0) {
      const response = await ticketService.addFiles(loadedTicket.value.customId, uploadedUrls);

      if (response && response.data) {
        loadedTicket.value = response.data;
      }

      toast.success('Arquivos anexados com sucesso!');
      emit('refresh');
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
    userStore.user?.id === loadedTicket.value.targetUser.id;

  const isTicketActive =
    loadedTicket.value.status !== TicketStatus.Completed &&
    loadedTicket.value.status !== TicketStatus.Rejected &&
    loadedTicket.value.status !== TicketStatus.Canceled;

  return isUserInvolved && isTicketActive;
});

const refreshSelectedTicket = async () => {
  if (!props.ticket?.customId) return;
  try {
    const updatedTicket = await ticketsStore.fetchTicketDetails(props.ticket.customId);
    loadedTicket.value = updatedTicket;
  } catch (error) {
    console.error('Error refreshing ticket:', error);
  }
};

const startEditingName = () => {
  if (!isRequester.value) return;
  isEditingName.value = true;
  editingName.value = loadedTicket.value?.name || '';
  nextTick(() => {
    nameInput.value?.focus();
  });
};

const saveTicketName = async () => {
  if (!editingName.value.trim()) {
    toast.error('O assunto do ticket não pode estar vazio');
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

    toast.success('Assunto do ticket atualizado com sucesso');
    emit('refresh');
  } catch {
    toast.error('Erro ao atualizar nome do ticket');
  }
};

const cancelEditingName = () => {
  isEditingName.value = false;
  editingName.value = loadedTicket.value?.name || '';
};

const startEditingDescription = () => {
  if (!isRequester.value) return;
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
    toast.error('Descrição do ticket não pode estar vazia');
    return;
  }

  try {
    await ticketService.update(loadedTicket.value!.customId, {
      description: editingDescription.value,
    });

    isEditingDescription.value = false;

    if (loadedTicket.value) {
      loadedTicket.value.description = editingDescription.value;
    }

    toast.success('Descrição do ticket atualizada com sucesso');
    emit('refresh');
  } catch {
    toast.error('Erro ao atualizar descrição do ticket');
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
        await ticketService.updateStatus(ticketId, { status: TicketStatus.InProgress });
        toast.success('Envio para verificação cancelado');

        emit('refresh');
      } catch {
        toast.error('Erro ao cancelar envio para verificação');
      }
    },
  );
};
</script>

<style scoped>
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
  min-height: 200px;
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
  background: #fff3f3 !important;
}

.deadline-danger .detail-value {
  color: #dc3545 !important;
  font-weight: bold !important;
}

.deadline-normal {
  background: #f0fff4 !important;
}

.deadline-normal .detail-value {
  color: #28a745 !important;
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
</style>
